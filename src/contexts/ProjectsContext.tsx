import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { Project } from '../types/project';
import { createEmptyProject } from '../data/emptyProject';
import { createSampleProject } from '../data/sampleProject';
import { uid } from '../utils/cn';

export type SaveState = 'idle' | 'saving' | 'saved' | 'offline' | 'error';

interface ProjectsContextValue {
  projects: Project[];
  loading: boolean;
  saveState: SaveState;
  lastSavedAt: string | null;
  getProject: (id: string) => Project | undefined;
  createProject: (name: string, type: string, template?: Project['formatting']['template']) => Project;
  updateProject: (id: string, updater: (project: Project) => Project) => void;
  duplicateProject: (id: string) => Project | undefined;
  renameProject: (id: string, name: string) => void;
  archiveProject: (id: string) => void;
  deleteProject: (id: string) => void;
  importProject: (project: Project) => Project;
}

const ProjectsContext = createContext<ProjectsContextValue | null>(null);

export function useProjects() {
  const ctx = useContext(ProjectsContext);
  if (!ctx) throw new Error('useProjects must be used inside ProjectsProvider');
  return ctx;
}

export function useProject(id: string | undefined) {
  const { getProject } = useProjects();
  return id ? getProject(id) : undefined;
}

const KEY = 'docuforge.projects';

function load(): Project[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [createSampleProject()];
    const parsed = JSON.parse(raw) as Project[];
    if (!Array.isArray(parsed) || parsed.length === 0) return [createSampleProject()];
    return parsed;
  } catch {
    return [createSampleProject()];
  }
}

export function ProjectsProvider({ children }: {children: React.ReactNode;}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [online, setOnline] = useState(typeof navigator === 'undefined' ? true : navigator.onLine);
  const timer = useRef<number | null>(null);
  const pending = useRef(false);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setProjects(load());
      setLoading(false);
    }, 320);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  const flush = useCallback(
    (next: Project[]) => {
      if (!online) {
        setSaveState('offline');
        pending.current = true;
        return;
      }
      try {
        window.localStorage.setItem(KEY, JSON.stringify(next));
        setSaveState('saved');
        setLastSavedAt(new Date().toISOString());
        pending.current = false;
      } catch {
        setSaveState('error');
      }
    },
    [online]
  );

  /** Debounced autosave. */
  const schedule = useCallback(
    (next: Project[]) => {
      setSaveState(online ? 'saving' : 'offline');
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => flush(next), 700);
    },
    [flush, online]
  );

  useEffect(() => {
    if (online && pending.current) flush(projects);
  }, [online, projects, flush]);

  const mutate = useCallback(
    (fn: (list: Project[]) => Project[]) => {
      setProjects((prev) => {
        const next = fn(prev);
        schedule(next);
        return next;
      });
    },
    [schedule]
  );

  const getProject = useCallback((id: string) => projects.find((p) => p.id === id), [projects]);

  const createProject = useCallback(
    (name: string, type: string, template: Project['formatting']['template'] = 'academic-classic') => {
      const project = createEmptyProject({ projectName: name, projectType: type });
      project.formatting.template = template;
      mutate((list) => [project, ...list]);
      return project;
    },
    [mutate]
  );

  const importProject = useCallback(
    (project: Project) => {
      const copy: Project = { ...project, id: uid('prj'), updatedAt: new Date().toISOString() };
      mutate((list) => [copy, ...list]);
      return copy;
    },
    [mutate]
  );

  const updateProject = useCallback(
    (id: string, updater: (project: Project) => Project) => {
      mutate((list) =>
      list.map((p) => p.id === id ? { ...updater(p), id: p.id, updatedAt: new Date().toISOString() } : p)
      );
    },
    [mutate]
  );

  const duplicateProject = useCallback(
    (id: string) => {
      const source = projects.find((p) => p.id === id);
      if (!source) return undefined;
      const copy: Project = {
        ...structuredClone(source),
        id: uid('prj'),
        status: 'Draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        basicInfo: { ...source.basicInfo, projectName: `${source.basicInfo.projectName} (Copy)` }
      };
      mutate((list) => [copy, ...list]);
      return copy;
    },
    [projects, mutate]
  );

  const renameProject = useCallback(
    (id: string, name: string) => updateProject(id, (p) => ({ ...p, basicInfo: { ...p.basicInfo, projectName: name } })),
    [updateProject]
  );

  const archiveProject = useCallback(
    (id: string) => updateProject(id, (p) => ({ ...p, status: p.status === 'Archived' ? 'Draft' : 'Archived' })),
    [updateProject]
  );

  const deleteProject = useCallback((id: string) => mutate((list) => list.filter((p) => p.id !== id)), [mutate]);

  const value = useMemo(
    () => ({
      projects,
      loading,
      saveState: online ? saveState : 'offline',
      lastSavedAt,
      getProject,
      createProject,
      updateProject,
      duplicateProject,
      renameProject,
      archiveProject,
      deleteProject,
      importProject
    }),
    [projects, loading, saveState, online, lastSavedAt, getProject, createProject, updateProject, duplicateProject, renameProject, archiveProject, deleteProject, importProject]
  );

  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>;
}