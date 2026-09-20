import type { Project } from '../types/project';
import type { WizardStepKey } from '../data/catalogs';

export type StepState = 'complete' | 'partial' | 'empty';

export function getStepStatus(project: Project, step: WizardStepKey): StepState {
  const b = project.basicInfo;
  const three = (full: boolean, some: boolean): StepState => full ? 'complete' : some ? 'partial' : 'empty';

  switch (step) {
    case 'basic':{
        const filled = [b.projectName, b.studentName, b.collegeName, b.department, b.academicYear, b.guideName].filter(Boolean).length;
        return three(filled >= 6, filled >= 1);
      }
    case 'requirements':
      return three(project.requirements.functional.length >= 3 && project.requirements.nonFunctional.length >= 2, project.requirements.functional.length + project.requirements.nonFunctional.length > 0);
    case 'objectives':
      return three(
        !!project.objectives.problemStatement && !!project.objectives.scope && project.objectives.objectives.length >= 2,
        !!project.objectives.problemStatement || project.objectives.objectives.length > 0
      );
    case 'technologies':
      return three(project.technologies.length >= 3, project.technologies.length > 0);
    case 'modules':
      return three(project.modules.length >= 3, project.modules.length > 0);
    case 'architecture':
      return three(project.diagrams.length >= 2 && !!project.content['ch3.architecture'], project.diagrams.length > 0 || !!project.content['ch3.architecture']);
    case 'database':
      return three(project.database.tables.length >= 2 && !!project.database.overview, project.database.tables.length > 0);
    case 'screenshots':
      return three(project.screenshots.length >= 3 && project.screenshots.every((s) => s.description), project.screenshots.length > 0);
    case 'testing':
      return three(project.testing.cases.length >= 3 && !!project.testing.strategy, project.testing.cases.length > 0);
    case 'documentation':
      return three(
        !!project.content.abstract && !!project.content['ch10.conclusion'] && !!project.content['ch10.future'],
        !!project.content.abstract || !!project.content['ch10.conclusion']
      );
    case 'preview':
      return project.formatting ? 'complete' : 'empty';
    case 'export':
      return project.versions.length ? 'complete' : 'empty';
    default:
      return 'empty';
  }
}