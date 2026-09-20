export type Priority = 'High' | 'Medium' | 'Low';
export type ProjectStatus = 'Draft' | 'In Progress' | 'Completed' | 'Archived';
export type TestStatus = 'Pass' | 'Fail' | 'Blocked' | 'Not Run';

export type TemplateId = 'academic-classic' | 'modern-academic' | 'professional-software' | 'minimal';

export interface BasicInfo {
  projectName: string;
  subtitle: string;
  projectType: string;
  studentName: string;
  enrollmentNumber: string;
  rollNumber: string;
  collegeName: string;
  universityName: string;
  department: string;
  semester: string;
  academicYear: string;
  guideName: string;
  teamMembers: {id: string;name: string;enrollment: string;}[];
  duration: string;
  version: string;
  collegeLogo: string | null;
}

export interface FunctionalRequirement {
  id: string;
  reqId: string;
  name: string;
  description: string;
  priority: Priority;
  module: string;
}

export interface NonFunctionalRequirement {
  id: string;
  category: string;
  name: string;
  description: string;
}

export interface Objectives {
  problemStatement: string;
  motivation: string;
  objectives: string[];
  scope: string;
  targetUsers: string[];
}

export interface Technology {
  id: string;
  category: string;
  name: string;
  version: string;
  purpose: string;
  usage: string;
}

export interface ProjectModule {
  id: string;
  moduleId: string;
  name: string;
  description: string;
  purpose: string;
  roles: string[];
  functions: string[];
  inputs: string[];
  outputs: string[];
  dependencies: string[];
}

export type DiagramType =
'Architecture Diagram' |
'Workflow Diagram' |
'Use Case Diagram' |
'Data Flow Diagram' |
'ER Diagram' |
'Class Diagram' |
'Sequence Diagram' |
'Activity Diagram';

export interface Diagram {
  id: string;
  type: DiagramType;
  title: string;
  description: string;
  chapter: string;
  imageUrl: string | null;
}

export interface DbColumn {
  id: string;
  name: string;
  type: string;
  key: string;
  constraints: string;
  description: string;
}

export interface DbTable {
  id: string;
  name: string;
  description: string;
  columns: DbColumn[];
}

export interface DatabaseDesign {
  type: string;
  overview: string;
  tables: DbTable[];
  relationships: string[];
  constraints: string[];
}

export interface Screenshot {
  id: string;
  title: string;
  module: string;
  screenType: string;
  description: string;
  functionalities: string[];
  notes: string;
  imageUrl: string | null;
}

export interface TestCase {
  id: string;
  testId: string;
  module: string;
  scenario: string;
  input: string;
  expected: string;
  actual: string;
  status: TestStatus;
  remarks: string;
}

export interface Formatting {
  pageSize: 'A4' | 'Letter';
  font: 'Times New Roman' | 'Arial' | 'Calibri' | 'Georgia';
  bodySize: number;
  h1Size: number;
  h2Size: number;
  h3Size: number;
  lineSpacing: 1 | 1.15 | 1.5 | 2;
  alignment: 'left' | 'center' | 'justify';
  margins: 'Normal' | 'Narrow' | 'Wide';
  pageNumbers: 'Bottom Center' | 'Bottom Right' | 'Top Right' | 'None';
  headerText: string;
  footerText: string;
  template: TemplateId;
}

/** AI / user authored prose, keyed by document section key. */
export type ContentMap = Record<string, string>;

export interface ProjectVersion {
  version: string;
  generatedAt: string;
  pages: number;
}

export interface Project {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: ProjectStatus;
  lastGeneratedAt: string | null;
  versions: ProjectVersion[];
  basicInfo: BasicInfo;
  requirements: {
    functional: FunctionalRequirement[];
    nonFunctional: NonFunctionalRequirement[];
  };
  objectives: Objectives;
  technologies: Technology[];
  modules: ProjectModule[];
  diagrams: Diagram[];
  database: DatabaseDesign;
  screenshots: Screenshot[];
  testing: {
    strategy: string;
    cases: TestCase[];
  };
  content: ContentMap;
  formatting: Formatting;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string | null;
  college: string;
  department: string;
}