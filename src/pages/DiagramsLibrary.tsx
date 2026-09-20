import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShapesIcon } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { useProjects } from '../contexts/ProjectsContext';

export function DiagramsLibrary() {
  const { projects } = useProjects();
  const navigate = useNavigate();

  const items = useMemo(
    () => projects.flatMap((p) => p.diagrams.map((d) => ({ diagram: d, projectName: p.basicInfo.projectName, projectId: p.id }))),
    [projects]
  );

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<ShapesIcon className="w-5 h-5" />}
        title="No diagrams yet"
        description="Add architecture, use case, data flow or ER diagrams inside a project and they will be collected here."
        action={<Button variant="primary" onClick={() => navigate('/app/projects')}>Open a project</Button>} />);


  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-ink">Diagrams</h1>
        <p className="text-[13.5px] text-ink2 mt-1">Architecture and design diagrams from every project.</p>
      </header>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map(({ diagram, projectName, projectId }) =>
        <article key={diagram.id} className="rounded-xl border border-line bg-surface overflow-hidden flex flex-col">
            <div className="aspect-[4/3] bg-white border-b border-line2 flex items-center justify-center overflow-hidden">
              {diagram.imageUrl ?
            <img src={diagram.imageUrl} alt={diagram.title} className="w-full h-full object-contain" loading="lazy" /> :

            <ShapesIcon className="w-5 h-5 text-ink3" aria-hidden />
            }
            </div>
            <div className="p-3.5 flex flex-col flex-1">
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-[13.5px] font-semibold text-ink">{diagram.title}</h2>
                <Badge>{diagram.type.replace(' Diagram', '')}</Badge>
              </div>
              <p className="text-[12.5px] text-ink2 mt-1.5 leading-relaxed line-clamp-3">{diagram.description || 'No description yet.'}</p>
              <p className="text-[12px] text-ink3 mt-2">{projectName}</p>
              <div className="mt-auto pt-3">
                <Button size="sm" onClick={() => navigate(`/project/${projectId}/architecture`)}>
                  Edit in project
                </Button>
              </div>
            </div>
          </article>
        )}
      </div>
    </div>);

}