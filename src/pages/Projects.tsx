import React, { useMemo, useState } from 'react';
import { FolderPlusIcon, PlusIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Select } from '../components/ui/Select';
import { Skeleton } from '../components/ui/Skeleton';
import { ProjectCard } from '../components/projects/ProjectCard';
import { NewProjectModal } from '../components/projects/NewProjectModal';
import { useProjects } from '../contexts/ProjectsContext';

const FILTERS = ['All statuses', 'Draft', 'In Progress', 'Completed', 'Archived'];

export function Projects() {
  const { projects, loading } = useProjects();
  const [filter, setFilter] = useState(FILTERS[0]);
  const [open, setOpen] = useState(false);

  const visible = useMemo(
    () => projects.filter((p) => filter === 'All statuses' ? p.status !== 'Archived' : p.status === filter),
    [projects, filter]
  );

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-ink">My Projects</h1>
          <p className="text-[13.5px] text-ink2 mt-1">Every project in your workspace and how complete its report is.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select options={FILTERS} value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter by status" className="w-[150px]" />
          <Button variant="primary" icon={<PlusIcon className="w-4 h-4" />} onClick={() => setOpen(true)}>
            Create Project
          </Button>
        </div>
      </header>

      {loading ?
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) =>
        <Skeleton key={i} className="h-56 w-full rounded-xl" />
        )}
        </div> :
      visible.length === 0 ?
      <EmptyState
        icon={<FolderPlusIcon className="w-5 h-5" />}
        title={`No ${filter === 'All statuses' ? '' : filter.toLowerCase() + ' '}projects`}
        description="Create a project and start building its documentation."
        action={
        <Button variant="primary" icon={<PlusIcon className="w-4 h-4" />} onClick={() => setOpen(true)}>
              Create Project
            </Button>
        } /> :


      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 items-stretch">
          {visible.map((p) =>
        <ProjectCard key={p.id} project={p} />
        )}
        </div>
      }

      <NewProjectModal open={open} onClose={() => setOpen(false)} />
    </div>);

}