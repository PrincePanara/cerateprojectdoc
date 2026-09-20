import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileTextIcon, FolderPlusIcon, PlusIcon, SearchIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Input } from '../components/ui/Input';
import { Skeleton } from '../components/ui/Skeleton';
import { ProjectCard } from '../components/projects/ProjectCard';
import { NewProjectModal } from '../components/projects/NewProjectModal';
import { useProjects } from '../contexts/ProjectsContext';
import { useAuth } from '../contexts/AuthContext';
import { getReadiness } from '../utils/validation';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export function Dashboard() {
  const { projects, loading } = useProjects();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const stats = useMemo(() => {
    const active = projects.filter((p) => p.status !== 'Archived');
    return [
    { label: 'Total Projects', value: active.length },
    { label: 'Completed', value: active.filter((p) => p.status === 'Completed').length },
    { label: 'Drafts', value: active.filter((p) => p.status === 'Draft').length },
    { label: 'Documents Generated', value: projects.reduce((acc, p) => acc + p.versions.length, 0) }];

  }, [projects]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.
    filter((p) => p.status !== 'Archived').
    filter((p) => !q || p.basicInfo.projectName.toLowerCase().includes(q) || p.basicInfo.projectType.toLowerCase().includes(q));
  }, [projects, query]);

  const inProgress = useMemo(
    () => [...visible].sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))[0],
    [visible]
  );

  return (
    <div className="flex flex-col gap-7">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-ink">
            {greeting()}, {user?.name?.split(' ')[0] ?? 'there'}
          </h1>
          <p className="text-[14px] text-ink2 mt-1">Continue building your project documentation.</p>
        </div>
        <Button variant="primary" icon={<PlusIcon className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
          Create Project
        </Button>
      </header>

      <dl className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-line rounded-xl overflow-hidden border border-line">
        {stats.map((s) =>
        <div key={s.label} className="bg-surface px-4 py-3.5">
            <dt className="text-[12.5px] text-ink3">{s.label}</dt>
            <dd className="text-[24px] font-semibold text-ink tabular-nums tracking-[-0.02em] mt-0.5">
              {loading ? <Skeleton className="h-7 w-10" /> : s.value}
            </dd>
          </div>
        )}
      </dl>

      {!loading && inProgress &&
      <section className="rounded-xl border border-line bg-surface p-5 flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold tracking-[0.08em] text-ink3">PICK UP WHERE YOU LEFT OFF</p>
            <h2 className="text-[17px] font-semibold text-ink mt-1.5 truncate">{inProgress.basicInfo.projectName}</h2>
            <p className="text-[13px] text-ink2 mt-1">
              {getReadiness(inProgress).percent}% complete · {inProgress.modules.length} modules ·{' '}
              {inProgress.screenshots.length} screenshots
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="primary" onClick={() => navigate(`/project/${inProgress.id}/basic`)}>
              Continue building
            </Button>
            <Button onClick={() => navigate(`/project/${inProgress.id}/preview`)}>Preview report</Button>
          </div>
        </section>
      }

      <section>
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="text-[16px] font-semibold text-ink">Your projects</h2>
          <div className="relative w-full max-w-[260px]">
            <SearchIcon className="w-4 h-4 text-ink3 absolute left-2.5 top-1/2 -translate-y-1/2" aria-hidden />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects"
              aria-label="Search projects"
              className="pl-8" />
            
          </div>
        </div>

        {loading ?
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {[0, 1, 2].map((i) =>
          <Skeleton key={i} className="h-56 w-full rounded-xl" />
          )}
          </div> :
        visible.length === 0 ?
        <EmptyState
          icon={query ? <SearchIcon className="w-5 h-5" /> : <FolderPlusIcon className="w-5 h-5" />}
          title={query ? 'No projects match that search' : 'No projects yet'}
          description={
          query ?
          'Try a different project name or type.' :
          'Create your first project and start building your documentation.'
          }
          action={
          query ?
          <Button onClick={() => setQuery('')}>Clear search</Button> :

          <Button variant="primary" icon={<PlusIcon className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
                  Create Project
                </Button>

          } /> :


        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 items-stretch">
            {visible.map((p) =>
          <ProjectCard key={p.id} project={p} />
          )}
          </div>
        }
      </section>

      {!loading && projects.some((p) => p.status === 'Archived') &&
      <section>
          <h2 className="text-[16px] font-semibold text-ink mb-3">Archived</h2>
          <ul className="rounded-xl border border-line bg-surface divide-y divide-line2">
            {projects.
          filter((p) => p.status === 'Archived').
          map((p) =>
          <li key={p.id} className="flex items-center justify-between gap-4 px-4 py-3">
                  <span className="flex items-center gap-2.5 min-w-0">
                    <FileTextIcon className="w-4 h-4 text-ink3 shrink-0" aria-hidden />
                    <span className="text-[13.5px] text-ink truncate">{p.basicInfo.projectName}</span>
                  </span>
                  <Button size="sm" onClick={() => navigate(`/project/${p.id}/basic`)}>
                    Open
                  </Button>
                </li>
          )}
          </ul>
        </section>
      }

      <NewProjectModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>);

}