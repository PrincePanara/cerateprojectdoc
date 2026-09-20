import type { Project } from '../../types/project';

export interface StepProps {
  project: Project;
  update: (updater: (project: Project) => Project) => void;
  goTo: (step: string) => void;
}