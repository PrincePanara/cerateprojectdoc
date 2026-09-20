import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNowStrict } from 'date-fns';
import { ArchiveIcon, CopyIcon, EyeIcon, FileDownIcon, MoreHorizontalIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import type { Project } from '../../types/project';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { getReadiness } from '../../utils/validation';
import { useProjects } from '../../contexts/ProjectsContext';

export function ProjectCard({ project }: {project: Project;}) {
  const navigate = useNavigate();
  const { duplicateProject, archiveProject, deleteProject, renameProject } = useProjects();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const readiness = useMemo(() => getReadiness(project), [project]);
  const sections = 10 + project.modules.length + project.screenshots.length;

  const tone = project.status === 'Completed' ? 'ok' : project.status === 'Archived' ? 'neutral' : project.status === 'In Progress' ? 'brand' : 'warn';

  return (
    <article className="group bg-surface border border-line rounded-xl shadow-card p-4 flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[14.5px] font-semibold text-ink truncate">{project.basicInfo.projectName}</h3>
          <p className="text-[12.5px] text-ink3 mt-0.5">{project.basicInfo.projectType}</p>
        </div>
        <div className="relative shrink-0" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={`More actions for ${project.basicInfo.projectName}`}
            aria-haspopup="menu"
            className="w-7 h-7 rounded-md text-ink3 hover:text-ink hover:bg-surface2 flex items-center justify-center transition-colors duration-150 ease-out">
            
            <MoreHorizontalIcon className="w-4 h-4" />
          </button>
          {menuOpen &&
          <div role="menu" className="absolute right-0 mt-1 w-44 bg-surface border border-line rounded-lg shadow-pop p-1 z-20">
              {[
            {
              label: 'Rename',
              icon: PencilIcon,
              onClick: () => {
                const next = window.prompt('Project name', project.basicInfo.projectName);
                if (next?.trim()) renameProject(project.id, next.trim());
              }
            },
            { label: 'Duplicate', icon: CopyIcon, onClick: () => duplicateProject(project.id) },
            { label: project.status === 'Archived' ? 'Unarchive' : 'Archive', icon: ArchiveIcon, onClick: () => archiveProject(project.id) }].
            map((item) =>
            <button
              key={item.label}
              role="menuitem"
              onClick={() => {
                item.onClick();
                setMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-2.5 h-8 rounded-md text-[13px] text-ink2 hover:bg-surface2 hover:text-ink transition-colors duration-150 ease-out">
              
                  <item.icon className="w-3.5 h-3.5" /> {item.label}
                </button>
            )}
              <button
              role="menuitem"
              onClick={() => {
                if (window.confirm(`Delete "${project.basicInfo.projectName}"? This cannot be undone.`)) deleteProject(project.id);
                setMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-2.5 h-8 rounded-md text-[13px] text-bad hover:bg-badSoft transition-colors duration-150 ease-out">
              
                <Trash2Icon className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          }
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-baseline justify-between mb-1.5">
          <span className="text-[12px] text-ink2">Completion</span>
          <span className="text-[13px] font-semibold text-ink tabular-nums">{readiness.percent}%</span>
        </div>
        <ProgressBar value={readiness.percent} tone={readiness.percent >= 80 ? 'ok' : readiness.percent >= 40 ? 'brand' : 'warn'} label="Documentation completion" />
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-2 text-[12px]">
        <div>
          <dt className="text-ink3">Sections</dt>
          <dd className="text-ink font-medium tabular-nums">{sections}</dd>
        </div>
        <div>
          <dt className="text-ink3">Screenshots</dt>
          <dd className="text-ink font-medium tabular-nums">{project.screenshots.length}</dd>
        </div>
        <div>
          <dt className="text-ink3">Status</dt>
          <dd>
            <Badge tone={tone as 'ok' | 'neutral' | 'brand' | 'warn'}>{project.status}</Badge>
          </dd>
        </div>
      </dl>

      <p className="mt-3 text-[12px] text-ink3">
        Edited {formatDistanceToNowStrict(new Date(project.updatedAt))} ago
      </p>

      <div className="mt-auto pt-4 flex items-center gap-2">
        <Button variant="primary" size="sm" onClick={() => navigate(`/project/${project.id}/basic`)}>
          Continue
        </Button>
        <Button size="sm" icon={<EyeIcon className="w-3.5 h-3.5" />} onClick={() => navigate(`/project/${project.id}/preview`)}>
          Preview
        </Button>
        <Button size="sm" variant="ghost" icon={<FileDownIcon className="w-3.5 h-3.5" />} onClick={() => navigate(`/project/${project.id}/export`)}>
          Generate
        </Button>
      </div>
    </article>);

}