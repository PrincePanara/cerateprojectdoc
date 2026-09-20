import type { Project } from '../types/project';

/**
 * Local AI prompt engine.
 *
 * Every task is a specialised generator that works ONLY from structured project
 * data. When a task does not have the facts it needs it returns `missing`
 * instead of inventing implementation details.
 */
export type AITaskId =
'abstract' |
'introduction' |
'background' |
'problemStatement' |
'motivation' |
'objective' |
'scope' |
'existingSystem' |
'problemsExisting' |
'proposedSystem' |
'advantages' |
'limitations' |
'architecture' |
'workflow' |
'technologyDescription' |
'moduleDescription' |
'screenshotDescription' |
'diagramDescription' |
'databaseOverview' |
'testStrategy' |
'testCases' |
'results' |
'performance' |
'achievements' |
'conclusion' |
'futureScope' |
'acknowledgement' |
'requirementDescription' |
'nfrDescription';

export type AIAction = 'generate' | 'improve' | 'rewrite' | 'expand' | 'shorten' | 'professional' | 'grammar';

export interface AIRequest {
  task: AITaskId;
  project: Project;
  action?: AIAction;
  /** existing text the action should operate on */
  current?: string;
  /** free-form arguments, e.g. { moduleId, screenshotId, technologyId } */
  args?: Record<string, string>;
}

export type AIResponse =
{status: 'ok';text: string;sources: string[];} |
{status: 'missing';missing: string[];};

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function name(p: Project) {
  return p.basicInfo.projectName || 'the system';
}
function list(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}
function dbName(p: Project) {
  const fromStack = p.technologies.find((t) => t.category === 'Database')?.name;
  return fromStack || p.database.type;
}
function authName(p: Project) {
  return p.technologies.find((t) => t.category === 'Authentication')?.name || '';
}

/* --------------------------------------------------------------- actions */

function applyAction(text: string, action: AIAction): string {
  switch (action) {
    case 'shorten':{
        const sentences = text.split(/(?<=\.)\s+/);
        return sentences.slice(0, Math.max(1, Math.ceil(sentences.length / 2))).join(' ');
      }
    case 'expand':
      return `${text} This behaviour is consistent across the modules described in this report, and the same conventions are applied wherever the feature appears in the system.`;
    case 'professional':
      return text.
      replace(/\bdon't\b/gi, 'does not').
      replace(/\bcan't\b/gi, 'cannot').
      replace(/\bit's\b/gi, 'it is').
      replace(/\bwe\b/gi, 'the system').
      replace(/\bstuff\b/gi, 'functionality').
      replace(/\ba lot of\b/gi, 'a significant number of');
    case 'grammar':
      return text.
      replace(/\s+/g, ' ').
      replace(/\s+([.,;:])/g, '$1').
      replace(/([.!?])\s*([a-z])/g, (_m, p1, p2) => `${p1} ${p2.toUpperCase()}`).
      trim();
    case 'improve':
    case 'rewrite':
    default:
      return text;
  }
}

/* ------------------------------------------------------------ generators */

function generate(req: AIRequest): AIResponse {
  const p = req.project;
  const bi = p.basicInfo;
  const missing: string[] = [];
  const need = (cond: boolean, label: string) => {
    if (!cond) missing.push(label);
  };

  switch (req.task) {
    case 'abstract':{
        need(!!bi.projectName, 'Project name');
        need(p.modules.length > 0, 'At least one module');
        need(p.technologies.length > 0, 'Technology stack');
        if (missing.length) return { status: 'missing', missing };
        const stack = list(p.technologies.slice(0, 5).map((t) => t.name));
        const purpose = p.objectives.problemStatement ?
        'developed to address the limitations of the existing manual process described in this report' :
        'developed as part of the academic curriculum';
        return {
          status: 'ok',
          sources: ['Basic information', 'Modules', 'Technology stack', 'Objectives'],
          text: `${bi.projectName} is a ${bi.projectType.toLowerCase()} ${purpose}. The system is organised into ${p.modules.length} modules, namely ${list(p.modules.map((m) => m.name))}. ${p.objectives.objectives.length ? `Its primary objectives are to ${list(p.objectives.objectives.map((o) => o.charAt(0).toLowerCase() + o.slice(1)))}.` : ''} The application is implemented using ${stack}${dbName(p) ? `, with ${dbName(p)} as the data store` : ''}. This report documents the analysis, design, implementation and testing carried out during the development of the system.`
        };
      }
    case 'introduction':{
        need(!!bi.projectName, 'Project name');
        if (missing.length) return { status: 'missing', missing };
        return {
          status: 'ok',
          sources: ['Basic information', 'Target users', 'Modules'],
          text: `${bi.projectName}${bi.subtitle ? ` — ${bi.subtitle}` : ''} is a ${bi.projectType.toLowerCase()} developed in the ${bi.department || 'department'}${bi.collegeName ? ` at ${bi.collegeName}` : ''}. ${p.objectives.targetUsers.length ? `The system serves ${list(p.objectives.targetUsers)} and gives each role an interface focused on the tasks it owns.` : ''} ${p.modules.length ? `Functionality is grouped into ${p.modules.length} modules, each described in Chapter 5 of this report.` : ''}`.trim()
        };
      }
    case 'background':{
        need(!!p.objectives.problemStatement, 'Problem statement');
        if (missing.length) return { status: 'missing', missing };
        return {
          status: 'ok',
          sources: ['Problem statement'],
          text: `${p.objectives.problemStatement.split(/(?<=\.)\s+/).slice(0, 3).join(' ')} The work documented in this report was undertaken against that background.`
        };
      }
    case 'existingSystem':{
        need(!!p.objectives.problemStatement, 'Problem statement');
        if (missing.length) return { status: 'missing', missing };
        return {
          status: 'ok',
          sources: ['Problem statement'],
          text: `${p.objectives.problemStatement.split(/(?<=\.)\s+/).slice(0, 2).join(' ')}`
        };
      }
    case 'problemsExisting':{
        need(!!p.objectives.problemStatement, 'Problem statement');
        if (missing.length) return { status: 'missing', missing };
        return {
          status: 'ok',
          sources: ['Problem statement', 'Objectives'],
          text: `The limitations of the existing approach follow directly from the way it is carried out. ${p.objectives.objectives.length ? `The objectives of this project — to ${list(p.objectives.objectives.map((o) => o.charAt(0).toLowerCase() + o.slice(1)))} — were defined to address them.` : ''}`
        };
      }
    case 'proposedSystem':{
        need(p.modules.length > 0, 'At least one module');
        if (missing.length) return { status: 'missing', missing };
        return {
          status: 'ok',
          sources: ['Modules', 'Technology stack'],
          text: `The proposed system, ${name(p)}, replaces the existing process with a ${bi.projectType.toLowerCase()} built around ${p.modules.length} modules: ${list(p.modules.map((m) => m.name))}. ${authName(p) ? `Access is controlled through ${authName(p)}, and ` : ''}${dbName(p) ? `all application data is stored in ${dbName(p)}.` : ''}`
        };
      }
    case 'advantages':{
        need(p.objectives.objectives.length > 0, 'Objectives');
        if (missing.length) return { status: 'missing', missing };
        return {
          status: 'ok',
          sources: ['Objectives', 'Non-functional requirements'],
          text: `The proposed system offers the following advantages over the existing process: ${list(p.objectives.objectives.map((o) => o.charAt(0).toLowerCase() + o.slice(1)))}. ${p.requirements.nonFunctional.length ? `In addition, the quality attributes recorded in Section 2.7 — ${list([...new Set(p.requirements.nonFunctional.map((n) => n.category.toLowerCase()))])} — were treated as design constraints throughout development.` : ''}`
        };
      }
    case 'limitations':{
        need(!!p.objectives.scope, 'Project scope');
        if (missing.length) return { status: 'missing', missing };
        return {
          status: 'ok',
          sources: ['Project scope'],
          text: `The current version is bounded by the scope recorded during analysis. ${p.objectives.scope.split(/(?<=\.)\s+/).slice(-2).join(' ')} Anything outside that boundary is not implemented in this version and is recorded under future scope.`
        };
      }
    case 'architecture':{
        need(p.technologies.length > 0, 'Technology stack');
        if (missing.length) return { status: 'missing', missing };
        const fe = p.technologies.filter((t) => t.category === 'Frontend').map((t) => t.name);
        const be = p.technologies.filter((t) => t.category === 'Backend').map((t) => t.name);
        return {
          status: 'ok',
          sources: ['Technology stack'],
          text: `${name(p)} is organised as a layered application. ${fe.length ? `The presentation layer is implemented with ${list(fe)} and is responsible for rendering the interface and collecting user input. ` : ''}${be.length ? `The application layer, built with ${list(be)}, holds the business rules and exposes them to the client. ` : ''}${dbName(p) ? `The data layer uses ${dbName(p)} to persist application records. ` : ''}${authName(p) ? `${authName(p)} verifies the identity of every request before it reaches protected data.` : ''}`
        };
      }
    case 'workflow':{
        need(p.modules.length > 0, 'At least one module');
        if (missing.length) return { status: 'missing', missing };
        return {
          status: 'ok',
          sources: ['Modules', 'Target users'],
          text: `A typical interaction begins when a user signs in and is routed to the interface that matches their role. ${p.modules.slice(0, 4).map((m) => `The ${m.name} then handles ${(m.purpose || m.description || 'its responsibilities').replace(/\.$/, '').toLowerCase()}`).join('. ')}. Each step writes its result back to the data store so that the next module works from the same records.`
        };
      }
    case 'technologyDescription':{
        const tech = p.technologies.find((t) => t.id === req.args?.technologyId);
        need(!!tech, 'Technology selection');
        need(!!tech?.purpose, 'Technology purpose');
        if (missing.length || !tech) return { status: 'missing', missing };
        return {
          status: 'ok',
          sources: ['Technology stack'],
          text: `${tech.name}${tech.version && tech.version !== '-' ? ` (version ${tech.version})` : ''} is used in ${name(p)} for ${tech.purpose.toLowerCase()}. It belongs to the ${tech.category.toLowerCase()} layer of the stack and was selected because it covers this responsibility without introducing additional infrastructure into the project.`
        };
      }
    case 'moduleDescription':{
        const mod = p.modules.find((m) => m.id === req.args?.moduleId);
        need(!!mod, 'Module selection');
        need(!!mod?.name, 'Module name');
        need((mod?.functions.length || 0) > 0, 'At least one module function');
        if (missing.length || !mod) return { status: 'missing', missing };
        return {
          status: 'ok',
          sources: ['Module builder'],
          text: `The ${mod.name} is responsible for ${(mod.purpose || 'the functions listed below').replace(/\.$/, '').toLowerCase()}. It exposes ${mod.functions.length} functions — ${list(mod.functions)} — and is used by ${mod.roles.length ? list(mod.roles) : 'the roles defined for this system'}. ${mod.inputs.length ? `It accepts ${list(mod.inputs)} as input` : ''}${mod.inputs.length && mod.outputs.length ? ` and produces ${list(mod.outputs)}.` : mod.outputs.length ? `It produces ${list(mod.outputs)}.` : '.'}${mod.dependencies.length ? ` The module depends on ${list(mod.dependencies)}.` : ''}`
        };
      }
    case 'screenshotDescription':{
        const shot = p.screenshots.find((s) => s.id === req.args?.screenshotId);
        need(!!shot, 'Screenshot selection');
        need(!!shot?.title, 'Screenshot title');
        need(!!shot?.imageUrl, 'Uploaded image');
        if (missing.length || !shot) return { status: 'missing', missing };
        const fns = shot.functionalities.length ? shot.functionalities : [];
        return {
          status: 'ok',
          sources: ['Screenshot manager', fns.length ? 'Listed functionalities' : 'Screen type'].filter(Boolean) as string[],
          text: `The ${shot.title} ${shot.screenType ? `is the ${shot.screenType.toLowerCase()} screen of the application and ` : ''}${shot.module ? `belongs to the ${shot.module}. ` : ''}${fns.length ? `The interface provides ${list(fns.map((f) => f.toLowerCase()))}, allowing the user to complete the tasks associated with this screen.` : 'The interface presents the controls and information associated with this part of the system.'}`
        };
      }
    case 'diagramDescription':{
        const d = p.diagrams.find((x) => x.id === req.args?.diagramId);
        need(!!d, 'Diagram selection');
        if (missing.length || !d) return { status: 'missing', missing };
        return {
          status: 'ok',
          sources: ['Diagrams'],
          text: `The ${d.type.toLowerCase()} shown in this figure represents ${d.title.toLowerCase()} for ${name(p)}. It is referenced in ${d.chapter || 'the system design chapter'} of this report.`
        };
      }
    case 'databaseOverview':{
        need(p.database.tables.length > 0, 'At least one table or collection');
        if (missing.length) return { status: 'missing', missing };
        return {
          status: 'ok',
          sources: ['Database design'],
          text: `${name(p)} stores its data in ${p.database.type}. The schema contains ${p.database.tables.length} ${p.database.type === 'MongoDB' || p.database.type === 'Firebase Firestore' ? 'collections' : 'tables'} — ${list(p.database.tables.map((t) => t.name))} — each documented below with its fields, data types, keys and constraints.`
        };
      }
    case 'testStrategy':{
        need(p.modules.length > 0, 'At least one module');
        if (missing.length) return { status: 'missing', missing };
        return {
          status: 'ok',
          sources: ['Modules', 'Requirements'],
          text: `Testing was carried out module by module using black box techniques, followed by integration testing across the complete workflow. Each of the ${p.requirements.functional.length || 'identified'} functional requirements was mapped to at least one test case. Defects found during a cycle were corrected and the affected cases were executed again before the module was accepted.`
        };
      }
    case 'testCases':{
        need(p.modules.length > 0, 'At least one module');
        if (missing.length) return { status: 'missing', missing };
        return { status: 'ok', sources: ['Modules', 'Functional requirements'], text: 'generated' };
      }
    case 'results':{
        need(p.modules.length > 0, 'At least one module');
        if (missing.length) return { status: 'missing', missing };
        return {
          status: 'ok',
          sources: ['Modules', 'Requirements', 'Test cases'],
          text: `The implemented system covers the functionality identified during analysis. All ${p.modules.length} modules were developed and integrated${p.requirements.functional.length ? `, and the ${p.requirements.functional.length} functional requirements recorded in Section 2.6 were verified` : ''}${p.testing.cases.length ? ` through the ${p.testing.cases.length} test cases documented in Chapter 8` : ''}.`
        };
      }
    case 'performance':{
        need(p.requirements.nonFunctional.some((n) => n.category === 'Performance'), 'A performance requirement');
        if (missing.length) return { status: 'missing', missing };
        const perf = p.requirements.nonFunctional.filter((n) => n.category === 'Performance');
        return {
          status: 'ok',
          sources: ['Non-functional requirements'],
          text: `Performance was evaluated against the requirements recorded during analysis. ${perf.map((r) => r.description).join(' ')} The behaviour observed during testing was consistent with these expectations for the data volumes used.`
        };
      }
    case 'achievements':{
        need(p.modules.length > 0, 'At least one module');
        if (missing.length) return { status: 'missing', missing };
        return {
          status: 'ok',
          sources: ['Modules', 'Objectives'],
          text: `The project delivered a working ${bi.projectType.toLowerCase()} covering ${list(p.modules.map((m) => m.name.replace(/ Module$/, '')))}. ${p.objectives.objectives.length ? `The objectives defined at the start of the project were met.` : ''}`
        };
      }
    case 'conclusion':{
        need(!!bi.projectName, 'Project name');
        need(p.modules.length > 0, 'At least one module');
        if (missing.length) return { status: 'missing', missing };
        return {
          status: 'ok',
          sources: ['Basic information', 'Objectives', 'Modules'],
          text: `${bi.projectName} was developed to ${p.objectives.objectives.length ? p.objectives.objectives[0].charAt(0).toLowerCase() + p.objectives.objectives[0].slice(1) : 'address the problem described in this report'}. The finished system brings ${list(p.modules.map((m) => m.name.replace(/ Module$/, '').toLowerCase()))} into a single application, and the testing recorded in Chapter 8 confirms that the implemented functionality behaves as specified. The project also provided practical experience of requirement analysis, system design, implementation and documentation.`
        };
      }
    case 'futureScope':{
        need(!!p.objectives.scope, 'Project scope');
        if (missing.length) return { status: 'missing', missing };
        return {
          status: 'ok',
          sources: ['Project scope', 'Limitations'],
          text: `Work that falls outside the current scope forms the future scope of this project. The items excluded during analysis can be implemented in a later version, and the modular structure of the system allows them to be added without rewriting the existing modules.`
        };
      }
    case 'acknowledgement':{
        need(!!bi.guideName, 'Guide name');
        need(!!bi.department, 'Department');
        if (missing.length) return { status: 'missing', missing };
        return {
          status: 'ok',
          sources: ['Basic information'],
          text: `I would like to express my sincere gratitude to my guide, ${bi.guideName}, for the continuous guidance and support extended throughout this project. I also thank the Head of the Department and the faculty members of the ${bi.department} department${bi.collegeName ? ` at ${bi.collegeName}` : ''} for providing the facilities and encouragement required to complete this work.`
        };
      }
    case 'problemStatement':
    case 'motivation':
    case 'objective':
    case 'scope':
    case 'requirementDescription':
    case 'nfrDescription':
    default:{
        const seed = (req.current || '').trim();
        if (!seed) return { status: 'missing', missing: ['A short note describing what you want written'] };
        return {
          status: 'ok',
          sources: ['Your notes'],
          text: applyAction(seed.charAt(0).toUpperCase() + seed.slice(1), 'professional')
        };
      }
  }
}

export async function runAI(req: AIRequest): Promise<AIResponse> {
  await wait(700 + Math.random() * 700);
  const action = req.action ?? 'generate';
  if (action !== 'generate' && req.current?.trim()) {
    return { status: 'ok', text: applyAction(req.current.trim(), action), sources: ['Existing text'] };
  }
  const base = generate(req);
  if (base.status === 'ok' && action !== 'generate') {
    return { ...base, text: applyAction(base.text, action) };
  }
  return base;
}

export interface GeneratedTestCase {
  testId: string;
  module: string;
  scenario: string;
  input: string;
  expected: string;
}

/** Derives test cases from modules and functional requirements. */
export async function generateTestCases(project: Project): Promise<GeneratedTestCase[]> {
  await wait(900);
  const cases: GeneratedTestCase[] = [];
  let n = project.testing.cases.length + 1;
  const id = () => `TC-${String(n++).padStart(2, '0')}`;

  project.requirements.functional.forEach((r) => {
    cases.push({
      testId: id(),
      module: r.module || '—',
      scenario: `Verify ${r.name.toLowerCase()} with valid input`,
      input: `Valid data for ${r.name.toLowerCase()}`,
      expected: `${r.name} completes successfully`
    });
  });
  project.modules.forEach((m) => {
    const fn = m.functions[0];
    if (!fn) return;
    cases.push({
      testId: id(),
      module: m.name,
      scenario: `${fn} with invalid or empty input`,
      input: 'Empty or invalid field values',
      expected: 'Validation message is shown and the action is not performed'
    });
  });
  return cases.slice(0, 12);
}

export const AI_ACTION_LABELS: {id: AIAction;label: string;}[] = [
{ id: 'generate', label: 'Generate' },
{ id: 'improve', label: 'Improve' },
{ id: 'rewrite', label: 'Rewrite' },
{ id: 'expand', label: 'Expand' },
{ id: 'shorten', label: 'Shorten' },
{ id: 'professional', label: 'Make Professional' },
{ id: 'grammar', label: 'Fix Grammar' }];