import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImageIcon } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Select } from '../components/ui/Select';
import { useProjects } from '../contexts/ProjectsContext';

export function ScreenshotsLibrary() {
  const { projects } = useProjects();
  const navigate = useNavigate();
  const [projectId, setProjectId] = useState('all');

  const items = useMemo(
    () =>
    projects.
    filter((p) => projectId === 'all' || p.id === projectId).
    flatMap((p) =>
    p.screenshots.map((s, i) => ({ screenshot: s, projectName: p.basicInfo.projectName, projectId: p.id, figure: `6.${i + 1}` }))
    ),
    [projects, projectId]
  );

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-ink">Screenshots</h1>
          <p className="text-[13.5px] text-ink2 mt-1">Every screenshot across your projects, with its figure number.</p>
        </div>
        <Select
          aria-label="Filter by project"
          className="w-[220px]"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          options={[{ value: 'all', label: 'All projects' }, ...projects.map((p) => ({ value: p.id, label: p.basicInfo.projectName }))]} />
        
      </header>

      {items.length === 0 ?
      <EmptyState
        icon={<ImageIcon className="w-5 h-5" />}
        title="No screenshots yet"
        description="Upload screenshots inside a project and they will appear here as numbered figures."
        action={<Button variant="primary" onClick={() => navigate('/app/projects')}>Open a project</Button>} /> :


      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map(({ screenshot, projectName, projectId: pid, figure }) =>
        <article key={screenshot.id} className="rounded-xl border border-line bg-surface overflow-hidden flex flex-col">
              <div className="aspect-[16/10] bg-surface2 border-b border-line2 flex items-center justify-center overflow-hidden">
                {screenshot.imageUrl ?
            <img src={screenshot.imageUrl} alt={screenshot.title} className="w-full h-full object-cover" loading="lazy" /> :

            <ImageIcon className="w-5 h-5 text-ink3" aria-hidden />
            }
              </div>
              <div className="p-3.5 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-[13.5px] font-semibold text-ink">{screenshot.title}</h2>
                  <Badge tone="brand">Fig {figure}</Badge>
                </div>
                <p className="text-[12.5px] text-ink2 mt-1.5 leading-relaxed line-clamp-3">
                  {screenshot.description || 'No description yet.'}
                </p>
                <p className="text-[12px] text-ink3 mt-2">{projectName}</p>
                <div className="mt-auto pt-3">
                  <Button size="sm" onClick={() => navigate(`/project/${pid}/screenshots`)}>
                    Edit in project
                  </Button>
                </div>
              </div>
            </article>
        )}
        </div>
      }
    </div>);

}