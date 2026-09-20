import type { Formatting, Project } from '../types/project';
import { uid } from '../utils/cn';

export const DEFAULT_FORMATTING: Formatting = {
  pageSize: 'A4',
  font: 'Times New Roman',
  bodySize: 12,
  h1Size: 16,
  h2Size: 14,
  h3Size: 13,
  lineSpacing: 1.5,
  alignment: 'justify',
  margins: 'Normal',
  pageNumbers: 'Bottom Center',
  headerText: '',
  footerText: '',
  template: 'academic-classic'
};

export function createEmptyProject(overrides?: Partial<Project['basicInfo']>): Project {
  const now = new Date().toISOString();
  return {
    id: uid('prj'),
    createdAt: now,
    updatedAt: now,
    status: 'Draft',
    lastGeneratedAt: null,
    versions: [],
    basicInfo: {
      projectName: 'Untitled Project',
      subtitle: '',
      projectType: 'Final Year Project',
      studentName: '',
      enrollmentNumber: '',
      rollNumber: '',
      collegeName: '',
      universityName: '',
      department: '',
      semester: '',
      academicYear: '',
      guideName: '',
      teamMembers: [],
      duration: '',
      version: '1.0',
      collegeLogo: null,
      ...overrides
    },
    requirements: { functional: [], nonFunctional: [] },
    objectives: {
      problemStatement: '',
      motivation: '',
      objectives: [],
      scope: '',
      targetUsers: []
    },
    technologies: [],
    modules: [],
    diagrams: [],
    database: { type: 'MySQL', overview: '', tables: [], relationships: [], constraints: [] },
    screenshots: [],
    testing: { strategy: '', cases: [] },
    content: {},
    formatting: { ...DEFAULT_FORMATTING }
  };
}