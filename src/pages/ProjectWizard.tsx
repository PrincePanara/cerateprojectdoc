import React, { useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, FileDownIcon, LayoutDashboardIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { SaveIndicator } from '../components/layout/SaveIndicator';
import { UserMenu } from '../components/layout/UserMenu';
import { StepNav } from '../components/wizard/StepNav';
import { BasicInfoStep } from '../components/wizard/steps/BasicInfoStep';
import { RequirementsStep } from '../components/wizard/steps/RequirementsStep';
import { ObjectivesStep } from '../components/wizard/steps/ObjectivesStep';
import { TechnologyStep } from '../components/wizard/steps/TechnologyStep';
import { ModulesStep } from '../components/wizard/steps/ModulesStep';
import { ArchitectureStep } from '../components/wizard/steps/ArchitectureStep';
import { DatabaseStep } from '../components/wizard/steps/DatabaseStep';
import { ScreenshotsStep } from '../components/wizard/steps/ScreenshotsStep';
import { TestingStep } from '../components/wizard/steps/TestingStep';
import { DocumentationStep } from '../components/wizard/steps/DocumentationStep';
import { PreviewStep } from '../components/wizard/steps/PreviewStep';
import { ExportStep } from '../components/wizard/steps/ExportStep';
import { WIZARD_STEPS, type WizardStepKey } from '../data/catalogs';
import { useProjects } from '../contexts/ProjectsContext';
import { getReadiness } from '../utils/validation';
import type { Project } from '../types/project';

export function ProjectWizard() {
  const { projectId, step } = useParams<{projectId: string;step: WizardStepKey;}>();
  const navigate = useNavigate();
  const { getProject, updateProject, loading } = useProjects();
  const project = projectId ? getProject(projectId) : undefined;

  const update = useCallback(
    (updater: (p: Project) => Project) => {
      if (projectId) updateProject(projectId, updater);
    },
    [projectId, updateProject]
  );

  const goTo = useCallback((next: string) => navigate(`/project/${projectId}/${next}`), [navigate, projectId]);

  const index = WIZARD_STEPS.findIndex((s) => s.key === step);
  const currentStep = (index >= 0 ? step : 'basic') as WizardStepKey;
  const readiness = useMemo(() => project ? getReadiness(project) : null, [project]);

  if (loading) {
    return (
      <div className="p-8 max-w-5xl mx-auto w-full space-y-4">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>);

  }

  if (!project) {
    return (
      <div className="min-h-full flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <EmptyState
            icon={<LayoutDashboardIcon className="w-5 h-5" />}
            title="Project not found"
            description="This project may have been deleted. Head back to the dashboard to pick another one."
            action={
            <Button variant="primary" onClick={() => navigate('/app')}>
                Back to dashboard
              </Button>
            } />
          
        </div>
      </div>);

  }

  const stepProps = { project, update, goTo };

  const content = (() => {
    switch (currentStep) {
      case 'requirements':
        return <RequirementsStep {...stepProps} />;
      case 'objectives':
        return <ObjectivesStep {...stepProps} />;
      case 'technologies':
        return <TechnologyStep {...stepProps} />;
      case 'modules':
        return <ModulesStep {...stepProps} />;
      case 'architecture':
        return <ArchitectureStep {...stepProps} />;
      case 'database':
        return <DatabaseStep {...stepProps} />;
      case 'screenshots':
        return <ScreenshotsStep {...stepProps} />;
      case 'testing':
        return <TestingStep {...stepProps} />;
      case 'documentation':
        return <DocumentationStep {...stepProps} />;
      case 'preview':
        return <PreviewStep {...stepProps} />;
      case 'export':
        return <ExportStep {...stepProps} />;
      case 'basic':
      default:
        return <BasicInfoStep {...stepProps} />;
    }
  })();

  const wide = currentStep === 'preview' || currentStep === 'export';

  return (
    <div className="min-h-full w-full bg-canvas flex flex-col">
      <header className="sticky top-0 z-30 bg-surface border-b border-line2">
        <div className="h-14 px-4 sm:px-6 flex items-center gap-4">
          <button
            onClick={() => navigate('/app')}
            className="text-ink2 hover:text-ink inline-flex items-center gap-1.5 text-[13px] transition-colors duration-150 ease-out">
            
            <ArrowLeftIcon className="w-4 h-4" /> <span className="hidden sm:inline">Dashboard</span>
          </button>
          <span className="h-5 w-px bg-line2" aria-hidden />
          <div className="min-w-0 flex-1">
            <h1 className="text-[14.5px] font-semibold text-ink truncate">{project.basicInfo.projectName}</h1>
            <p className="text-[12px] text-ink3 truncate">
              {project.basicInfo.projectType}
              {readiness ? ` · ${readiness.percent}% complete` : ''}
            </p>
          </div>
          <div className="hidden md:block">
            <SaveIndicator />
          </div>
          <Button size="sm" onClick={() => goTo('preview')}>
            Preview
          </Button>
          <Button size="sm" variant="primary" icon={<FileDownIcon className="w-3.5 h-3.5" />} onClick={() => goTo('export')}>
            Generate DOCX
          </Button>
          <span className="hidden lg:block">
            <UserMenu />
          </span>
        </div>
        <StepNav project={project} current={currentStep} onSelect={goTo} />
      </header>

      <main className={`flex-1 w-full mx-auto px-4 sm:px-6 py-6 ${wide ? 'max-w-[1400px]' : 'max-w-[980px]'}`}>
        {content}
      </main>

      <footer className="sticky bottom-0 border-t border-line2 bg-surface/95 backdrop-blur">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <Button
            size="sm"
            icon={<ChevronLeftIcon className="w-4 h-4" />}
            disabled={index <= 0}
            onClick={() => goTo(WIZARD_STEPS[Math.max(0, index - 1)].key)}>
            
            Back
          </Button>
          <span className="text-[12.5px] text-ink3">
            Step {Math.max(1, index + 1)} of {WIZARD_STEPS.length} · {WIZARD_STEPS[Math.max(0, index)].label}
          </span>
          <Button
            size="sm"
            variant="primary"
            icon={<ChevronRightIcon className="w-4 h-4 order-2" />}
            disabled={index >= WIZARD_STEPS.length - 1}
            onClick={() => goTo(WIZARD_STEPS[Math.min(WIZARD_STEPS.length - 1, index + 1)].key)}>
            
            Next
          </Button>
        </div>
        <div className="md:hidden px-4 pb-2">
          <SaveIndicator />
        </div>
      </footer>
    </div>);

}