import type { Project } from '../types/project';
import { buildDocument, type DocumentModel } from './documentModel';
import { TEMPLATES } from '../data/catalogs';

export type CheckState = 'ok' | 'warn' | 'missing';

export interface ReadinessItem {
  key: string;
  label: string;
  state: CheckState;
  detail: string;
  step: string;
  required: boolean;
}

export interface QualityIssue {
  id: string;
  severity: 'error' | 'warning';
  message: string;
  step: string;
}

export interface Readiness {
  items: ReadinessItem[];
  percent: number;
  blocking: number;
}

function state(ok: boolean, partial: boolean): CheckState {
  if (ok) return 'ok';
  return partial ? 'warn' : 'missing';
}

export function getReadiness(project: Project): Readiness {
  const b = project.basicInfo;
  const template = TEMPLATES.find((t) => t.id === project.formatting.template);
  const basicFilled = [b.projectName, b.studentName, b.collegeName, b.department, b.academicYear, b.guideName].filter(Boolean).length;

  const items: ReadinessItem[] = [
  {
    key: 'basic', label: 'Project Information', step: 'basic', required: true,
    state: state(basicFilled >= 6, basicFilled >= 3),
    detail: basicFilled >= 6 ? 'All identification fields provided' : `${basicFilled} of 6 key fields provided`
  },
  {
    key: 'abstract', label: 'Abstract', step: 'documentation', required: !!template?.requires.includes('abstract'),
    state: state(!!project.content.abstract, false),
    detail: project.content.abstract ? `${project.content.abstract.split(/\s+/).length} words` : 'Not written yet'
  },
  {
    key: 'requirements', label: 'Requirements', step: 'requirements', required: true,
    state: state(project.requirements.functional.length >= 3 && project.requirements.nonFunctional.length >= 2, project.requirements.functional.length > 0),
    detail: `${project.requirements.functional.length} functional · ${project.requirements.nonFunctional.length} non-functional`
  },
  {
    key: 'objectives', label: 'Objectives & Scope', step: 'objectives', required: true,
    state: state(!!project.objectives.problemStatement && project.objectives.objectives.length >= 2 && !!project.objectives.scope, !!project.objectives.problemStatement),
    detail: project.objectives.objectives.length ? `${project.objectives.objectives.length} objectives listed` : 'No objectives listed'
  },
  {
    key: 'technologies', label: 'Technology Stack', step: 'technologies', required: true,
    state: state(project.technologies.length >= 3, project.technologies.length > 0),
    detail: `${project.technologies.length} technologies selected`
  },
  {
    key: 'modules', label: 'Modules', step: 'modules', required: true,
    state: state(project.modules.length >= 3, project.modules.length > 0),
    detail: `${project.modules.length} modules defined`
  },
  {
    key: 'architecture', label: 'Architecture & Diagrams', step: 'architecture', required: false,
    state: state(project.diagrams.length >= 2, project.diagrams.length > 0),
    detail: `${project.diagrams.length} diagrams added`
  },
  {
    key: 'screenshots', label: 'Screenshots', step: 'screenshots', required: false,
    state: state(project.screenshots.length >= 3 && project.screenshots.every((s) => s.description), project.screenshots.length > 0),
    detail: `${project.screenshots.length} screenshots · ${project.screenshots.filter((s) => !s.description).length} missing descriptions`
  },
  {
    key: 'database', label: 'Database Design', step: 'database', required: false,
    state: state(project.database.tables.length >= 2 && !!project.database.overview, project.database.tables.length > 0),
    detail: `${project.database.tables.length} tables / collections`
  },
  {
    key: 'testing', label: 'Testing', step: 'testing', required: !!template?.requires.includes('testing'),
    state: state(project.testing.cases.length >= 3 && !!project.testing.strategy, project.testing.cases.length > 0),
    detail: `${project.testing.cases.length} test cases`
  },
  {
    key: 'conclusion', label: 'Conclusion & Future Scope', step: 'documentation', required: true,
    state: state(!!project.content['ch10.conclusion'] && !!project.content['ch10.future'], !!project.content['ch10.conclusion']),
    detail: project.content['ch10.conclusion'] ? 'Written' : 'Not written yet'
  }];


  const score = items.reduce((acc, i) => acc + (i.state === 'ok' ? 1 : i.state === 'warn' ? 0.5 : 0), 0);
  const percent = Math.round(score / items.length * 100);
  const blocking = items.filter((i) => i.required && i.state === 'missing').length;
  return { items, percent, blocking };
}

export function getQualityIssues(project: Project, model?: DocumentModel): QualityIssue[] {
  const doc = model ?? buildDocument(project);
  const issues: QualityIssue[] = [];

  if (!project.basicInfo.projectName || project.basicInfo.projectName === 'Untitled Project')
  issues.push({ id: 'name', severity: 'error', message: 'The project still uses the default name.', step: 'basic' });

  project.screenshots.forEach((s) => {
    if (!s.description) issues.push({ id: `shot-${s.id}`, severity: 'error', message: `Screenshot "${s.title}" has no description.`, step: 'screenshots' });
    if (!s.imageUrl) issues.push({ id: `img-${s.id}`, severity: 'error', message: `Screenshot "${s.title}" has no image attached.`, step: 'screenshots' });
    if (s.title.length > 70) issues.push({ id: `long-${s.id}`, severity: 'warning', message: `Screenshot title "${s.title.slice(0, 40)}…" is very long and will wrap in the caption.`, step: 'screenshots' });
  });

  project.diagrams.forEach((d) => {
    if (!d.imageUrl) issues.push({ id: `diag-${d.id}`, severity: 'error', message: `Diagram "${d.title}" has no image attached.`, step: 'architecture' });
  });

  const figNumbers = doc.figures.map((f) => f.number);
  const dupFig = figNumbers.filter((n, i) => figNumbers.indexOf(n) !== i);
  if (dupFig.length) issues.push({ id: 'dupfig', severity: 'error', message: `Duplicate figure numbers detected: ${[...new Set(dupFig)].join(', ')}.`, step: 'preview' });

  const tblNumbers = doc.tables.map((t) => t.number);
  const dupTbl = tblNumbers.filter((n, i) => tblNumbers.indexOf(n) !== i);
  if (dupTbl.length) issues.push({ id: 'duptbl', severity: 'error', message: `Duplicate table numbers detected: ${[...new Set(dupTbl)].join(', ')}.`, step: 'preview' });

  doc.nodes.forEach((n) => {
    if (n.blocks.every((b) => b.kind === 'missing') && n.blocks.length)
    issues.push({ id: `empty-${n.key}`, severity: 'warning', message: `Section ${n.number ? n.number + ' ' : ''}${n.title} is empty.`, step: 'documentation' });
    if (n.title.length > 80)
    issues.push({ id: `head-${n.key}`, severity: 'warning', message: `Heading "${n.title.slice(0, 40)}…" is extremely long.`, step: 'documentation' });
  });

  project.requirements.functional.forEach((r) => {
    if (!r.description) issues.push({ id: `fr-${r.id}`, severity: 'warning', message: `Requirement ${r.reqId} has no description.`, step: 'requirements' });
  });

  if (!project.content.references) issues.push({ id: 'refs', severity: 'warning', message: 'No references have been added.', step: 'documentation' });
  if (project.formatting.bodySize < 9 || project.formatting.bodySize > 16)
  issues.push({ id: 'fmt', severity: 'warning', message: 'Body font size is outside the usual 10–14pt range for a report.', step: 'preview' });

  return issues;
}

export function getQualityScore(issues: QualityIssue[]): number {
  const errors = issues.filter((i) => i.severity === 'error').length;
  const warnings = issues.filter((i) => i.severity === 'warning').length;
  return Math.max(0, 100 - errors * 8 - warnings * 3);
}

export function getCompletion(project: Project): number {
  return getReadiness(project).percent;
}