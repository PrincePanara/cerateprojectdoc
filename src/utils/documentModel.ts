import type { Project } from '../types/project';

export type Block =
{kind: 'p';text: string;align?: 'left' | 'center' | 'justify';} |
{kind: 'bullets';items: string[];} |
{kind: 'numbers';items: string[];} |
{kind: 'table';number: string;caption: string;head: string[];rows: string[][];} |
{kind: 'figure';number: string;caption: string;imageUrl: string | null;note?: string;} |
{kind: 'missing';text: string;} |
{kind: 'toc';entries: {text: string;level: number;}[];} |
{kind: 'cover';} |
{kind: 'kv';rows: [string, string][];};

export interface DocNode {
  key: string;
  title: string;
  number: string;
  /** 0 = front matter, 1 = chapter, 2 = section */
  level: 0 | 1 | 2;
  /** key into project.content for AI / user authored prose */
  contentKey?: string;
  blocks: Block[];
  /** node starts on a fresh page */
  pageBreak?: boolean;
}

export interface DocumentModel {
  nodes: DocNode[];
  figures: {number: string;caption: string;}[];
  tables: {number: string;caption: string;}[];
  estimatedPages: number;
}

function prose(project: Project, key: string, missingLabel: string, align: 'justify' | 'left' = 'justify'): Block[] {
  const text = (project.content[key] || '').trim();
  if (!text) return [{ kind: 'missing', text: missingLabel }];
  return text.
  split(/\n{2,}/).
  map((p) => ({ kind: 'p', text: p.trim(), align }) as Block);
}

function section(
key: string,
number: string,
title: string,
blocks: Block[],
contentKey?: string)
: DocNode {
  return { key, number, title, level: 2, blocks, contentKey };
}

export function buildDocument(project: Project): DocumentModel {
  const nodes: DocNode[] = [];
  const figures: {number: string;caption: string;}[] = [];
  const tables: {number: string;caption: string;}[] = [];

  const bi = project.basicInfo;
  const figureCounters: Record<string, number> = {};
  const tableCounters: Record<string, number> = {};

  const nextFigure = (chapter: number, caption: string) => {
    figureCounters[chapter] = (figureCounters[chapter] || 0) + 1;
    const number = `${chapter}.${figureCounters[chapter]}`;
    figures.push({ number, caption });
    return number;
  };
  const nextTable = (chapter: number, caption: string) => {
    tableCounters[chapter] = (tableCounters[chapter] || 0) + 1;
    const number = `${chapter}.${tableCounters[chapter]}`;
    tables.push({ number, caption });
    return number;
  };

  /* ---------------------------------------------------------------- front */
  nodes.push({ key: 'cover', title: 'Cover Page', number: '', level: 0, blocks: [{ kind: 'cover' }], pageBreak: true });

  nodes.push({
    key: 'certificate',
    title: 'Certificate',
    number: '',
    level: 0,
    pageBreak: true,
    contentKey: 'certificate',
    blocks: project.content.certificate ?
    prose(project, 'certificate', '') :
    [
    {
      kind: 'p',
      align: 'justify',
      text: `This is to certify that the project work entitled "${bi.projectName || '[Project Name]'}" has been carried out by ${bi.studentName || '[Student Name]'}${bi.enrollmentNumber ? ` (Enrollment No. ${bi.enrollmentNumber})` : ''} of ${bi.department || '[Department]'}, ${bi.collegeName || '[College Name]'}, in partial fulfilment of the requirements for the award of the degree, under my supervision during the academic year ${bi.academicYear || '[Academic Year]'}.`
    },
    { kind: 'kv', rows: [['Guide', bi.guideName || '—'], ['Head of Department', '—'], ['Date', '—']] }]

  });

  nodes.push({
    key: 'declaration',
    title: 'Declaration',
    number: '',
    level: 0,
    pageBreak: true,
    contentKey: 'declaration',
    blocks: project.content.declaration ?
    prose(project, 'declaration', '') :
    [
    {
      kind: 'p',
      align: 'justify',
      text: `I hereby declare that the project report entitled "${bi.projectName || '[Project Name]'}" submitted to ${bi.universityName || '[University Name]'} is a record of original work carried out by me under the guidance of ${bi.guideName || '[Guide Name]'}. The content of this report has not been submitted elsewhere for the award of any other degree or diploma.`
    },
    { kind: 'kv', rows: [['Name', bi.studentName || '—'], ['Enrollment No.', bi.enrollmentNumber || '—'], ['Date', '—']] }]

  });

  nodes.push({
    key: 'acknowledgement',
    title: 'Acknowledgement',
    number: '',
    level: 0,
    pageBreak: true,
    contentKey: 'acknowledgement',
    blocks: prose(project, 'acknowledgement', 'Information required — add an acknowledgement, or generate one with the AI assistant.')
  });

  nodes.push({
    key: 'abstract',
    title: 'Abstract',
    number: '',
    level: 0,
    pageBreak: true,
    contentKey: 'abstract',
    blocks: prose(project, 'abstract', 'Information required — the abstract has not been written yet.')
  });

  /* ------------------------------------------------------------- chapters */
  const chapters: DocNode[] = [];

  // Chapter 1
  chapters.push({ key: 'ch1', title: 'Introduction', number: '1', level: 1, pageBreak: true, blocks: [] });
  chapters.push(section('ch1.overview', '1.1', 'Project Overview', prose(project, 'ch1.overview', 'Information required — project overview not written.'), 'ch1.overview'));
  chapters.push(section('ch1.background', '1.2', 'Background', prose(project, 'ch1.background', 'Information required — background not written.'), 'ch1.background'));
  chapters.push(
    section('ch1.problem', '1.3', 'Problem Statement',
    project.objectives.problemStatement ?
    project.objectives.problemStatement.split(/\n{2,}/).map((t) => ({ kind: 'p', text: t.trim(), align: 'justify' }) as Block) :
    [{ kind: 'missing', text: 'Information required — add a problem statement in Objectives & Scope.' }])
  );
  chapters.push(
    section('ch1.motivation', '1.4', 'Motivation',
    project.objectives.motivation ?
    [{ kind: 'p', text: project.objectives.motivation, align: 'justify' }] :
    [{ kind: 'missing', text: 'Information required — add the project motivation in Objectives & Scope.' }])
  );
  chapters.push(
    section('ch1.objectives', '1.5', 'Objectives',
    project.objectives.objectives.length ?
    [{ kind: 'p', text: 'The objectives of the project are as follows:' }, { kind: 'bullets', items: project.objectives.objectives }] :
    [{ kind: 'missing', text: 'Information required — no objectives have been added.' }])
  );
  chapters.push(
    section('ch1.scope', '1.6', 'Scope',
    project.objectives.scope ?
    [{ kind: 'p', text: project.objectives.scope, align: 'justify' }] :
    [{ kind: 'missing', text: 'Information required — add the project scope in Objectives & Scope.' }])
  );
  chapters.push(
    section('ch1.users', '1.7', 'Target Users',
    project.objectives.targetUsers.length ?
    [{ kind: 'p', text: 'The system is intended for the following categories of users:' }, { kind: 'bullets', items: project.objectives.targetUsers }] :
    [{ kind: 'missing', text: 'Information required — no target users selected.' }])
  );

  // Chapter 2
  chapters.push({ key: 'ch2', title: 'System Analysis', number: '2', level: 1, pageBreak: true, blocks: [] });
  chapters.push(section('ch2.existing', '2.1', 'Existing System', prose(project, 'ch2.existing', 'Information required — describe the existing system.'), 'ch2.existing'));
  chapters.push(section('ch2.problems', '2.2', 'Problems in Existing System', prose(project, 'ch2.problems', 'Information required — describe the problems in the existing system.'), 'ch2.problems'));
  chapters.push(section('ch2.proposed', '2.3', 'Proposed System', prose(project, 'ch2.proposed', 'Information required — describe the proposed system.'), 'ch2.proposed'));
  chapters.push(section('ch2.advantages', '2.4', 'Advantages', prose(project, 'ch2.advantages', 'Information required — list the advantages of the proposed system.'), 'ch2.advantages'));
  chapters.push(section('ch2.limitations', '2.5', 'Limitations', prose(project, 'ch2.limitations', 'Information required — state the limitations of the proposed system.'), 'ch2.limitations'));

  const fr = project.requirements.functional;
  chapters.push(
    section('ch2.fr', '2.6', 'Functional Requirements',
    fr.length ?
    [
    { kind: 'p', text: 'The functional requirements identified for the system are listed below.' },
    {
      kind: 'table',
      number: nextTable(2, 'Functional Requirements'),
      caption: 'Functional Requirements',
      head: ['ID', 'Requirement', 'Description', 'Module', 'Priority'],
      rows: fr.map((r) => [r.reqId, r.name, r.description, r.module || '—', r.priority])
    }] :

    [{ kind: 'missing', text: 'Information required — no functional requirements have been added.' }])
  );

  const nfr = project.requirements.nonFunctional;
  chapters.push(
    section('ch2.nfr', '2.7', 'Non-Functional Requirements',
    nfr.length ?
    [
    { kind: 'p', text: 'The quality attributes expected from the system are described below.' },
    {
      kind: 'table',
      number: nextTable(2, 'Non-Functional Requirements'),
      caption: 'Non-Functional Requirements',
      head: ['Category', 'Requirement', 'Description'],
      rows: nfr.map((r) => [r.category, r.name, r.description])
    }] :

    [{ kind: 'missing', text: 'Information required — no non-functional requirements have been added.' }])
  );

  // Chapter 3
  chapters.push({ key: 'ch3', title: 'System Design', number: '3', level: 1, pageBreak: true, blocks: [] });
  const archDiagram = project.diagrams.find((d) => d.type === 'Architecture Diagram');
  chapters.push(
    section('ch3.architecture', '3.1', 'System Architecture',
    [
    ...prose(project, 'ch3.architecture', 'Information required — describe the system architecture.'),
    ...(archDiagram ?
    [{ kind: 'figure', number: nextFigure(3, archDiagram.title), caption: archDiagram.title, imageUrl: archDiagram.imageUrl, note: archDiagram.description } as Block] :
    [])],

    'ch3.architecture')
  );
  const flowDiagram = project.diagrams.find((d) => d.type === 'Workflow Diagram' || d.type === 'Activity Diagram');
  chapters.push(
    section('ch3.workflow', '3.2', 'System Workflow',
    [
    ...prose(project, 'ch3.workflow', 'Information required — describe the system workflow.'),
    ...(flowDiagram ?
    [{ kind: 'figure', number: nextFigure(3, flowDiagram.title), caption: flowDiagram.title, imageUrl: flowDiagram.imageUrl, note: flowDiagram.description } as Block] :
    [])],

    'ch3.workflow')
  );
  const others = project.diagrams.filter((d) => d !== archDiagram && d !== flowDiagram);
  chapters.push(
    section('ch3.diagrams', '3.3', 'System Diagrams',
    others.length ?
    others.flatMap((d) => {
      const number = nextFigure(3, d.title);
      const blocks: Block[] = [];
      if (d.description) blocks.push({ kind: 'p', text: d.description, align: 'justify' });
      blocks.push({ kind: 'figure', number, caption: d.title, imageUrl: d.imageUrl });
      return blocks;
    }) :
    [{ kind: 'missing', text: 'Information required — no use case, data flow or ER diagram has been added.' }])
  );

  // Chapter 4
  chapters.push({ key: 'ch4', title: 'Technology Stack', number: '4', level: 1, pageBreak: true, blocks: [] });
  const byCategory = (cat: string) => project.technologies.filter((t) => t.category === cat);
  const techSection = (key: string, number: string, title: string, cat: string) => {
    const list = byCategory(cat);
    return section(key, number, title,
    list.length ?
    list.flatMap((t) => {
      const blocks: Block[] = [
      { kind: 'p', text: `${t.name}${t.version && t.version !== '-' ? ` (version ${t.version})` : ''} — ${t.purpose || 'used in this project'}.`, align: 'left' }];

      if (t.usage) blocks.push({ kind: 'p', text: t.usage, align: 'justify' });else
      blocks.push({ kind: 'missing', text: `Information required — usage description for ${t.name}.` });
      return blocks;
    }) :
    [{ kind: 'missing', text: `Information required — no ${title.toLowerCase()} selected.` }]);
  };
  chapters.push(techSection('ch4.frontend', '4.1', 'Frontend Technologies', 'Frontend'));
  chapters.push(techSection('ch4.backend', '4.2', 'Backend Technologies', 'Backend'));
  chapters.push(techSection('ch4.database', '4.3', 'Database', 'Database'));
  chapters.push(techSection('ch4.auth', '4.4', 'Authentication', 'Authentication'));
  chapters.push(techSection('ch4.hosting', '4.5', 'Hosting', 'Cloud / Hosting'));
  chapters.push(techSection('ch4.tools', '4.6', 'Development Tools', 'Tools'));
  if (project.technologies.length) {
    chapters.push(
      section('ch4.summary', '4.7', 'Technology Summary', [
      {
        kind: 'table',
        number: nextTable(4, 'Technology Stack Summary'),
        caption: 'Technology Stack Summary',
        head: ['Category', 'Technology', 'Version', 'Purpose'],
        rows: project.technologies.map((t) => [t.category, t.name, t.version || '-', t.purpose || '—'])
      }]
      )
    );
  }

  // Chapter 5
  chapters.push({ key: 'ch5', title: 'System Modules', number: '5', level: 1, pageBreak: true, blocks: [] });
  chapters.push(
    section('ch5.overview', '5.1', 'Module Overview',
    project.modules.length ?
    [
    { kind: 'p', text: `The system is divided into ${project.modules.length} modules. Each module groups a set of related functions and is described in detail in the sections that follow.` },
    {
      kind: 'table',
      number: nextTable(5, 'Module Overview'),
      caption: 'Module Overview',
      head: ['ID', 'Module', 'Purpose', 'Roles'],
      rows: project.modules.map((m) => [m.moduleId, m.name, m.purpose || m.description || '—', m.roles.join(', ') || '—'])
    }] :

    [{ kind: 'missing', text: 'Information required — no modules have been added.' }])
  );
  project.modules.forEach((m, i) => {
    const blocks: Block[] = [];
    if (m.description) blocks.push({ kind: 'p', text: m.description, align: 'justify' });else
    blocks.push({ kind: 'missing', text: `Information required — description for ${m.name}.` });
    if (m.purpose) blocks.push({ kind: 'p', text: `Purpose: ${m.purpose}`, align: 'justify' });
    if (m.functions.length) {
      blocks.push({ kind: 'p', text: 'Functions:' });
      blocks.push({ kind: 'bullets', items: m.functions });
    }
    const kv: [string, string][] = [];
    if (m.roles.length) kv.push(['User Roles', m.roles.join(', ')]);
    if (m.inputs.length) kv.push(['Inputs', m.inputs.join(', ')]);
    if (m.outputs.length) kv.push(['Outputs', m.outputs.join(', ')]);
    if (m.dependencies.length) kv.push(['Dependencies', m.dependencies.join(', ')]);
    if (kv.length) blocks.push({ kind: 'kv', rows: kv });
    chapters.push(section(`ch5.m${m.id}`, `5.${i + 2}`, m.name, blocks));
  });

  // Chapter 6
  chapters.push({ key: 'ch6', title: 'System Screens', number: '6', level: 1, pageBreak: true, blocks: [] });
  if (!project.screenshots.length) {
    chapters.push(section('ch6.empty', '6.1', 'Screens', [{ kind: 'missing', text: 'Information required — no screenshots have been uploaded.' }]));
  }
  project.screenshots.forEach((s, i) => {
    const blocks: Block[] = [];
    if (s.description) blocks.push({ kind: 'p', text: s.description, align: 'justify' });else
    blocks.push({ kind: 'missing', text: `Information required — description for the "${s.title}" screenshot.` });
    blocks.push({ kind: 'figure', number: nextFigure(6, s.title), caption: s.title, imageUrl: s.imageUrl });
    if (s.functionalities.length) {
      blocks.push({ kind: 'p', text: 'Functionalities available on this screen:' });
      blocks.push({ kind: 'bullets', items: s.functionalities });
    }
    if (s.notes) blocks.push({ kind: 'p', text: `Note: ${s.notes}` });
    chapters.push(section(`ch6.s${s.id}`, `6.${i + 1}`, s.title, blocks));
  });

  // Chapter 7
  chapters.push({ key: 'ch7', title: 'Database', number: '7', level: 1, pageBreak: true, blocks: [] });
  chapters.push(
    section('ch7.overview', '7.1', 'Database Overview',
    [
    { kind: 'p', text: `The application uses ${project.database.type} as its data store.` },
    ...(project.database.overview ?
    [{ kind: 'p', text: project.database.overview, align: 'justify' } as Block] :
    [{ kind: 'missing', text: 'Information required — add a database overview.' } as Block])]
    )
  );
  chapters.push(
    section('ch7.tables', '7.2', 'Tables / Collections',
    project.database.tables.length ?
    project.database.tables.flatMap((t) => {
      const blocks: Block[] = [];
      if (t.description) blocks.push({ kind: 'p', text: `${t.name} — ${t.description}`, align: 'justify' });
      blocks.push({
        kind: 'table',
        number: nextTable(7, `${t.name} table structure`),
        caption: `${t.name} table structure`,
        head: ['Field', 'Type', 'Key', 'Constraints', 'Description'],
        rows: t.columns.map((c) => [c.name, c.type, c.key, c.constraints || '—', c.description || '—'])
      });
      return blocks;
    }) :
    [{ kind: 'missing', text: 'Information required — no tables or collections have been defined.' }])
  );
  chapters.push(
    section('ch7.relationships', '7.3', 'Relationships',
    project.database.relationships.length ?
    [{ kind: 'bullets', items: project.database.relationships }] :
    [{ kind: 'missing', text: 'Information required — no relationships have been described.' }])
  );
  chapters.push(
    section('ch7.constraints', '7.4', 'Constraints',
    project.database.constraints.length ?
    [{ kind: 'bullets', items: project.database.constraints }] :
    [{ kind: 'missing', text: 'Information required — no constraints have been described.' }])
  );

  // Chapter 8
  chapters.push({ key: 'ch8', title: 'Testing', number: '8', level: 1, pageBreak: true, blocks: [] });
  chapters.push(
    section('ch8.strategy', '8.1', 'Testing Strategy',
    project.testing.strategy ?
    [{ kind: 'p', text: project.testing.strategy, align: 'justify' }] :
    [{ kind: 'missing', text: 'Information required — describe the testing strategy.' }])
  );
  chapters.push(
    section('ch8.cases', '8.2', 'Test Cases',
    project.testing.cases.length ?
    [
    {
      kind: 'table',
      number: nextTable(8, 'Test Cases'),
      caption: 'Test Cases',
      head: ['Test ID', 'Module', 'Scenario', 'Expected Result', 'Actual Result', 'Status'],
      rows: project.testing.cases.map((c) => [c.testId, c.module || '—', c.scenario, c.expected, c.actual || '—', c.status])
    }] :

    [{ kind: 'missing', text: 'Information required — no test cases have been added.' }])
  );
  const passed = project.testing.cases.filter((c) => c.status === 'Pass').length;
  chapters.push(
    section('ch8.results', '8.3', 'Results',
    project.testing.cases.length ?
    [
    {
      kind: 'p',
      align: 'justify',
      text: `A total of ${project.testing.cases.length} test cases were executed, of which ${passed} passed and ${project.testing.cases.length - passed} did not pass. Defects identified during a test cycle were corrected and the affected cases were executed again.`
    }] :

    [{ kind: 'missing', text: 'Information required — test results depend on the test cases above.' }])
  );

  // Chapter 9
  chapters.push({ key: 'ch9', title: 'Results', number: '9', level: 1, pageBreak: true, blocks: [] });
  chapters.push(section('ch9.results', '9.1', 'Project Results', prose(project, 'ch9.results', 'Information required — describe the project results.'), 'ch9.results'));
  chapters.push(section('ch9.performance', '9.2', 'Performance', prose(project, 'ch9.performance', 'Information required — describe the observed performance.'), 'ch9.performance'));
  chapters.push(section('ch9.achievements', '9.3', 'Achievements', prose(project, 'ch9.achievements', 'Information required — describe the achievements of the project.'), 'ch9.achievements'));

  // Chapter 10
  chapters.push({ key: 'ch10', title: 'Conclusion', number: '10', level: 1, pageBreak: true, blocks: [] });
  chapters.push(section('ch10.conclusion', '10.1', 'Conclusion', prose(project, 'ch10.conclusion', 'Information required — the conclusion has not been written yet.'), 'ch10.conclusion'));
  chapters.push(section('ch10.future', '10.2', 'Future Scope', prose(project, 'ch10.future', 'Information required — the future scope has not been written yet.'), 'ch10.future'));

  chapters.push({
    key: 'references',
    title: 'References',
    number: '',
    level: 0,
    pageBreak: true,
    contentKey: 'references',
    blocks: project.content.references ?
    [{ kind: 'numbers', items: project.content.references.split('\n').filter(Boolean) }] :
    [{ kind: 'missing', text: 'Information required — no references have been added.' }]
  });
  chapters.push({
    key: 'appendix',
    title: 'Appendix',
    number: '',
    level: 0,
    pageBreak: true,
    contentKey: 'appendix',
    blocks: project.content.appendix ?
    prose(project, 'appendix', '') :
    [{ kind: 'p', text: 'No appendix material has been attached to this report.' }]
  });

  /* ------------------------------------------------- toc / lof / lot last */
  const tocEntries = chapters.
  filter((n) => n.level <= 2).
  map((n) => ({ text: n.number ? `${n.number} ${n.title}` : n.title, level: n.level === 1 ? 1 : n.level === 0 ? 1 : 2 }));

  nodes.push({ key: 'toc', title: 'Table of Contents', number: '', level: 0, pageBreak: true, blocks: [{ kind: 'toc', entries: tocEntries }] });
  nodes.push({
    key: 'lof',
    title: 'List of Figures',
    number: '',
    level: 0,
    pageBreak: true,
    blocks: figures.length ?
    [{ kind: 'toc', entries: figures.map((f) => ({ text: `Figure ${f.number}: ${f.caption}`, level: 1 })) }] :
    [{ kind: 'missing', text: 'No figures have been added to this document.' }]
  });
  nodes.push({
    key: 'lot',
    title: 'List of Tables',
    number: '',
    level: 0,
    pageBreak: true,
    blocks: tables.length ?
    [{ kind: 'toc', entries: tables.map((t) => ({ text: `Table ${t.number}: ${t.caption}`, level: 1 })) }] :
    [{ kind: 'missing', text: 'No tables have been added to this document.' }]
  });

  nodes.push(...chapters);

  const estimatedPages = estimatePages(nodes);
  return { nodes, figures, tables, estimatedPages };
}

function estimatePages(nodes: DocNode[]): number {
  let lines = 0;
  for (const n of nodes) {
    if (n.pageBreak) lines += 6;
    lines += n.level === 1 ? 8 : 3;
    for (const b of n.blocks) {
      switch (b.kind) {
        case 'p':
          lines += Math.ceil(b.text.length / 95) + 1;
          break;
        case 'bullets':
        case 'numbers':
          lines += b.items.length + 1;
          break;
        case 'table':
          lines += b.rows.length * 2 + 4;
          break;
        case 'figure':
          lines += 16;
          break;
        case 'toc':
          lines += b.entries.length + 2;
          break;
        case 'cover':
          lines += 40;
          break;
        case 'kv':
          lines += b.rows.length + 1;
          break;
        default:
          lines += 2;
      }
    }
  }
  return Math.max(1, Math.round(lines / 38));
}

export function countMissingBlocks(model: DocumentModel): number {
  return model.nodes.reduce((acc, n) => acc + n.blocks.filter((b) => b.kind === 'missing').length, 0);
}