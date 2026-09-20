import type { DiagramType, TemplateId } from '../types/project';

export const PROJECT_TYPES = [
'Web Application',
'Mobile Application',
'Desktop Application',
'AI/ML Project',
'DBMS Project',
'Software Project',
'Research Project',
'Final Year Project',
'Mini Project',
'Other'];


export const TECH_CATEGORIES = [
'Frontend',
'Backend',
'Database',
'Authentication',
'Cloud / Hosting',
'Tools'] as
const;

export const TECH_CATALOG: Record<string, string[]> = {
  Frontend: ['React', 'Next.js', 'Angular', 'Vue', 'Svelte', 'HTML5', 'CSS3', 'Tailwind CSS', 'TypeScript', 'Flutter'],
  Backend: ['Node.js', 'Express', 'Python', 'Django', 'Java', 'Spring Boot', 'PHP', 'Laravel', '.NET', 'Go'],
  Database: ['MySQL', 'PostgreSQL', 'MongoDB', 'Firebase Firestore', 'SQLite', 'Redis', 'Oracle'],
  Authentication: ['Firebase Auth', 'JWT', 'OAuth 2.0', 'Auth0', 'Session Based', 'Clerk'],
  'Cloud / Hosting': ['Vercel', 'Netlify', 'AWS', 'Firebase Hosting', 'Azure', 'Google Cloud', 'Render'],
  Tools: ['Git', 'GitHub', 'Figma', 'VS Code', 'Postman', 'Jira', 'Docker', 'Draw.io']
};

export const NFR_CATEGORIES = [
'Performance',
'Security',
'Scalability',
'Reliability',
'Usability',
'Maintainability',
'Availability',
'Compatibility'];


export const USER_ROLES = ['Admin', 'Faculty', 'Student', 'Customer', 'Employee', 'Guest'];

export const DIAGRAM_TYPES: DiagramType[] = [
'Architecture Diagram',
'Workflow Diagram',
'Use Case Diagram',
'Data Flow Diagram',
'ER Diagram',
'Class Diagram',
'Sequence Diagram',
'Activity Diagram'];


export const DB_TYPES = ['MySQL', 'PostgreSQL', 'MongoDB', 'Firebase Firestore', 'SQLite', 'Other'];

export const COLUMN_TYPES = ['INT', 'VARCHAR', 'TEXT', 'BOOLEAN', 'DATE', 'TIMESTAMP', 'DECIMAL', 'JSON', 'STRING', 'OBJECT ID'];

export const KEY_TYPES = ['PK', 'FK', 'UNIQUE', '-'];

export const SCREEN_TYPES = [
'Login / Auth',
'Dashboard',
'List / Table',
'Form',
'Detail View',
'Report',
'Settings',
'Landing',
'Other'];


export interface TemplateDef {
  id: TemplateId;
  name: string;
  description: string;
  font: 'Times New Roman' | 'Arial' | 'Calibri' | 'Georgia';
  accent: string;
  requires: string[];
}

export const TEMPLATES: TemplateDef[] = [
{
  id: 'academic-classic',
  name: 'Academic Classic',
  description: 'Traditional college project report with certificate, declaration and Times New Roman typography.',
  font: 'Times New Roman',
  accent: '#111827',
  requires: ['cover', 'certificate', 'declaration', 'abstract']
},
{
  id: 'modern-academic',
  name: 'Modern Academic',
  description: 'Clean modern university documentation with generous spacing and Calibri body text.',
  font: 'Calibri',
  accent: '#4F46E5',
  requires: ['cover', 'abstract']
},
{
  id: 'professional-software',
  name: 'Professional Software Report',
  description: 'Enterprise style software documentation with dense tables and Arial headings.',
  font: 'Arial',
  accent: '#0F172A',
  requires: ['cover', 'abstract', 'testing']
},
{
  id: 'minimal',
  name: 'Minimal',
  description: 'Simple black and white professional report. No decoration, maximum readability.',
  font: 'Georgia',
  accent: '#000000',
  requires: ['cover']
}];


export const WIZARD_STEPS = [
{ key: 'basic', label: 'Basic Info' },
{ key: 'requirements', label: 'Requirements' },
{ key: 'objectives', label: 'Objectives' },
{ key: 'technologies', label: 'Technologies' },
{ key: 'modules', label: 'Modules' },
{ key: 'architecture', label: 'Architecture' },
{ key: 'database', label: 'Database' },
{ key: 'screenshots', label: 'Screenshots' },
{ key: 'testing', label: 'Testing' },
{ key: 'documentation', label: 'Documentation' },
{ key: 'preview', label: 'Preview' },
{ key: 'export', label: 'Export' }] as
const;

export type WizardStepKey = (typeof WIZARD_STEPS)[number]['key'];