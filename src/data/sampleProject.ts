import type { Project } from '../types/project';
import { createEmptyProject } from './emptyProject';

const SHOT_DASHBOARD = "/81821d60-16ec-408a-8325-37f03a5a10de.jpg";
const SHOT_LOGIN = "/a1b4ff10-6150-4fbc-8da7-939044a8a1e3.jpg";
const SHOT_EXAM = "/5735cd82-05d7-4e0c-8dcf-72d5ad0cbf4e.jpg";
const DIAGRAM_ER = "/3ef0b3ef-16c3-414d-8c20-3a02a5cd07e5.jpg";

export function createSampleProject(): Project {
  const base = createEmptyProject();
  const project: Project = {
    ...base,
    id: 'prj_sample_qubeso',
    status: 'In Progress',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    basicInfo: {
      projectName: 'Qubeso Exam Portal',
      subtitle: 'An online examination and result management platform',
      projectType: 'Final Year Project',
      studentName: 'Aarav Mehta',
      enrollmentNumber: '210320116045',
      rollNumber: 'CE-45',
      collegeName: 'Sardar Vallabhbhai Institute of Technology',
      universityName: 'Gujarat Technological University',
      department: 'Computer Engineering',
      semester: '8th Semester',
      academicYear: '2025 - 2026',
      guideName: 'Prof. R. K. Sharma',
      teamMembers: [
      { id: 'tm1', name: 'Aarav Mehta', enrollment: '210320116045' },
      { id: 'tm2', name: 'Isha Patel', enrollment: '210320116052' }],

      duration: '6 Months (Jan 2026 – Jun 2026)',
      version: '1.0',
      collegeLogo: null
    },
    requirements: {
      functional: [
      { id: 'f1', reqId: 'FR-01', name: 'User Registration', description: 'Students can create an account using their enrollment number and institutional email address.', priority: 'High', module: 'Authentication' },
      { id: 'f2', reqId: 'FR-02', name: 'User Login', description: 'Registered users can sign in securely and are routed to a role specific dashboard.', priority: 'High', module: 'Authentication' },
      { id: 'f3', reqId: 'FR-03', name: 'Admin Dashboard', description: 'Administrators can monitor students, exams, results and system activity from one screen.', priority: 'High', module: 'Admin Panel' },
      { id: 'f4', reqId: 'FR-04', name: 'Exam Creation', description: 'Faculty can create an exam with a title, duration, marks and a selected question set.', priority: 'High', module: 'Exam Management' },
      { id: 'f5', reqId: 'FR-05', name: 'Result Management', description: 'The system evaluates submitted answers and publishes results to students.', priority: 'Medium', module: 'Results' }],

      nonFunctional: [
      { id: 'n1', category: 'Performance', name: 'Response Time', description: 'Any page of the portal should render within two seconds on a standard broadband connection.' },
      { id: 'n2', category: 'Security', name: 'Protected Access', description: 'Exam content and results are only accessible to authenticated users holding the correct role.' },
      { id: 'n3', category: 'Reliability', name: 'Answer Persistence', description: 'Answers are saved as the candidate progresses so that a disconnection does not lose the attempt.' },
      { id: 'n4', category: 'Usability', name: 'Clear Exam Interface', description: 'The exam screen keeps the timer, question palette and navigation visible at all times.' }]

    },
    objectives: {
      problemStatement:
      'Examinations in the institute are currently conducted on paper and evaluated manually. Question papers must be printed and distributed, answer sheets are collected and evaluated by hand, and results are compiled in spreadsheets before being published on a notice board. The process is slow, consumes staff time, and leaves room for transcription errors in the final marksheet.',
      motivation:
      'A centralised online examination portal removes the repetitive manual work around conducting an exam. Faculty can reuse question banks, evaluation of objective questions becomes automatic, and students receive results without waiting for manual compilation.',
      objectives: [
      'Replace manual paper based examination with a centralised online portal',
      'Reduce human error during evaluation and result compilation',
      'Provide a single source of truth for questions, attempts and results',
      'Give faculty reusable question banks and reporting tools',
      'Allow students to view their results immediately after publication'],

      scope:
      'The system covers registration and authentication, question bank management, exam scheduling and delivery, automatic evaluation of objective questions, result publication and administrative reporting. Subjective answer evaluation, proctoring through video, and payment handling are outside the scope of the current version.',
      targetUsers: ['Admin', 'Faculty', 'Student']
    },
    technologies: [
    { id: 't1', category: 'Frontend', name: 'React', version: '18.3', purpose: 'User interface', usage: 'The entire client interface is built as React components, which keeps each screen of the portal isolated and reusable.' },
    { id: 't2', category: 'Frontend', name: 'TypeScript', version: '5.4', purpose: 'Type safety', usage: 'TypeScript is used across the client so that data structures such as exams, questions and attempts are checked at compile time.' },
    { id: 't3', category: 'Frontend', name: 'Tailwind CSS', version: '3.4', purpose: 'Styling', usage: 'Tailwind CSS provides the styling layer and keeps spacing, colour and typography consistent across every screen.' },
    { id: 't4', category: 'Database', name: 'Firebase Firestore', version: '10.x', purpose: 'Data storage', usage: 'Firestore stores users, question banks, exam definitions, attempts and published results as document collections.' },
    { id: 't5', category: 'Authentication', name: 'Firebase Auth', version: '10.x', purpose: 'Identity', usage: 'Firebase Authentication handles registration, sign in and session management for all three user roles.' },
    { id: 't6', category: 'Cloud / Hosting', name: 'Firebase Hosting', version: '-', purpose: 'Deployment', usage: 'The compiled client is deployed to Firebase Hosting and served over HTTPS.' },
    { id: 't7', category: 'Tools', name: 'GitHub', version: '-', purpose: 'Version control', usage: 'Source code is tracked in a GitHub repository with feature branches for each module.' }],

    modules: [
    {
      id: 'm1', moduleId: 'MOD-01', name: 'Authentication Module',
      description: 'Handles registration, login, password reset and role based routing for all portal users.',
      purpose: 'Ensure that only verified users access the portal and that each user reaches the correct dashboard.',
      roles: ['Admin', 'Faculty', 'Student'],
      functions: ['Register Account', 'Login', 'Logout', 'Reset Password', 'Role Based Redirect'],
      inputs: ['Email address', 'Password', 'Enrollment number'],
      outputs: ['Authenticated session', 'User role'],
      dependencies: ['Firebase Auth']
    },
    {
      id: 'm2', moduleId: 'MOD-02', name: 'Student Dashboard Module',
      description: 'Presents upcoming exams, attempted exams and published results to the signed in student.',
      purpose: 'Give the student a single screen that shows what to do next and what has already been completed.',
      roles: ['Student'],
      functions: ['View Upcoming Exams', 'Start Exam', 'View Result History', 'Download Marksheet'],
      inputs: ['Student identifier'],
      outputs: ['Exam list', 'Result summary'],
      dependencies: ['Authentication Module', 'Exam Management Module']
    },
    {
      id: 'm3', moduleId: 'MOD-03', name: 'Exam Management Module',
      description: 'Allows faculty to create, schedule, publish and close examinations.',
      purpose: 'Manage the lifecycle of an examination from creation through to closure.',
      roles: ['Faculty', 'Admin'],
      functions: ['Create Exam', 'Attach Question Set', 'Schedule Exam', 'Publish Exam', 'Close Exam'],
      inputs: ['Exam title', 'Duration', 'Total marks', 'Question set'],
      outputs: ['Published exam', 'Attempt records'],
      dependencies: ['Question Management Module']
    },
    {
      id: 'm4', moduleId: 'MOD-04', name: 'Question Management Module',
      description: 'Maintains the reusable question bank grouped by subject and difficulty.',
      purpose: 'Let faculty build question banks once and reuse them across multiple examinations.',
      roles: ['Faculty'],
      functions: ['Add Question', 'Edit Question', 'Delete Question', 'Import Questions', 'Tag by Subject'],
      inputs: ['Question text', 'Options', 'Correct answer', 'Marks'],
      outputs: ['Question bank entries'],
      dependencies: ['Firestore']
    },
    {
      id: 'm5', moduleId: 'MOD-05', name: 'Results Module',
      description: 'Evaluates submitted attempts, calculates scores and publishes results.',
      purpose: 'Remove manual evaluation and produce consistent, verifiable results.',
      roles: ['Faculty', 'Admin', 'Student'],
      functions: ['Evaluate Attempt', 'Calculate Score', 'Publish Result', 'Export Result Sheet'],
      inputs: ['Submitted attempt', 'Answer key'],
      outputs: ['Score', 'Published result'],
      dependencies: ['Exam Management Module']
    },
    {
      id: 'm6', moduleId: 'MOD-06', name: 'Admin Panel Module',
      description: 'Central administration for users, roles, exams and system reports.',
      purpose: 'Give administrators oversight of the whole portal from one place.',
      roles: ['Admin'],
      functions: ['Manage Users', 'Assign Roles', 'Monitor Exams', 'View Reports', 'System Configuration'],
      inputs: ['Administrative actions'],
      outputs: ['Updated user records', 'Reports'],
      dependencies: ['Authentication Module']
    }],

    diagrams: [
    { id: 'd1', type: 'ER Diagram', title: 'Entity Relationship Diagram of the Exam Portal', description: 'Shows the users, exams, questions, attempts and results collections and the relationships between them.', chapter: 'Chapter 3 — System Design', imageUrl: DIAGRAM_ER }],

    database: {
      type: 'Firebase Firestore',
      overview:
      'The portal stores data in Firebase Firestore as document collections. Each collection is described below with its fields, types and constraints. Document identifiers are generated by Firestore unless stated otherwise.',
      tables: [
      {
        id: 'tb1', name: 'users', description: 'Stores every portal account along with the role that determines access.',
        columns: [
        { id: 'c1', name: 'user_id', type: 'STRING', key: 'PK', constraints: 'NOT NULL', description: 'Unique identifier of the user' },
        { id: 'c2', name: 'name', type: 'STRING', key: '-', constraints: 'NOT NULL', description: 'Full name of the user' },
        { id: 'c3', name: 'email', type: 'STRING', key: 'UNIQUE', constraints: 'NOT NULL', description: 'Institutional email address' },
        { id: 'c4', name: 'enrollment_no', type: 'STRING', key: 'UNIQUE', constraints: 'NULL for staff', description: 'Enrollment number of a student' },
        { id: 'c5', name: 'role', type: 'STRING', key: '-', constraints: 'admin | faculty | student', description: 'Access role of the account' }]

      },
      {
        id: 'tb2', name: 'exams', description: 'Holds exam definitions created by faculty.',
        columns: [
        { id: 'c6', name: 'exam_id', type: 'STRING', key: 'PK', constraints: 'NOT NULL', description: 'Unique identifier of the exam' },
        { id: 'c7', name: 'title', type: 'STRING', key: '-', constraints: 'NOT NULL', description: 'Title of the examination' },
        { id: 'c8', name: 'duration_min', type: 'INT', key: '-', constraints: '> 0', description: 'Duration of the exam in minutes' },
        { id: 'c9', name: 'total_marks', type: 'INT', key: '-', constraints: '> 0', description: 'Maximum marks of the exam' },
        { id: 'c10', name: 'created_by', type: 'STRING', key: 'FK', constraints: 'references users.user_id', description: 'Faculty who created the exam' }]

      },
      {
        id: 'tb3', name: 'results', description: 'Stores the evaluated outcome of a student attempt.',
        columns: [
        { id: 'c11', name: 'result_id', type: 'STRING', key: 'PK', constraints: 'NOT NULL', description: 'Unique identifier of the result' },
        { id: 'c12', name: 'exam_id', type: 'STRING', key: 'FK', constraints: 'references exams.exam_id', description: 'Exam the result belongs to' },
        { id: 'c13', name: 'user_id', type: 'STRING', key: 'FK', constraints: 'references users.user_id', description: 'Student who attempted the exam' },
        { id: 'c14', name: 'score', type: 'DECIMAL', key: '-', constraints: '>= 0', description: 'Marks obtained by the student' },
        { id: 'c15', name: 'published_at', type: 'TIMESTAMP', key: '-', constraints: 'NULL until published', description: 'Time the result was published' }]

      }],

      relationships: [
      'One user (faculty) can create many exams — one to many between users and exams.',
      'One exam can produce many results — one to many between exams and results.',
      'One student can hold many results, one per attempted exam.'],

      constraints: [
      'Email addresses are unique across the users collection.',
      'A result cannot exist without a valid exam reference and user reference.',
      'Score can never exceed the total marks defined on the related exam.']

    },
    screenshots: [
    {
      id: 's1', title: 'Login Screen', module: 'Authentication Module', screenType: 'Login / Auth',
      description: 'The login screen accepts the registered email address and password of a user. On successful authentication the user is routed to the dashboard that matches their role.',
      functionalities: ['Email and password entry', 'Credential validation', 'Role based redirect', 'Password reset link'],
      notes: '', imageUrl: SHOT_LOGIN
    },
    {
      id: 's2', title: 'Admin Dashboard', module: 'Admin Panel Module', screenType: 'Dashboard',
      description: 'The Admin Dashboard provides a centralised overview of portal activity. The interface contains navigation controls, summary cards, a student data table and management actions that allow administrators to monitor and manage the application.',
      functionalities: ['User management', 'Search and filtering', 'Summary statistics', 'Performance overview', 'Record level actions'],
      notes: '', imageUrl: SHOT_DASHBOARD
    },
    {
      id: 's3', title: 'Exam Attempt Screen', module: 'Exam Management Module', screenType: 'Detail View',
      description: 'The exam attempt screen presents one question at a time alongside a question palette and a countdown timer, so the candidate can track remaining time and move between questions.',
      functionalities: ['Question navigation palette', 'Option selection', 'Countdown timer', 'Save and submit'],
      notes: '', imageUrl: SHOT_EXAM
    }],

    testing: {
      strategy:
      'The portal was tested using manual black box testing at the module level followed by integration testing across the complete examination workflow. Each functional requirement was mapped to at least one test case, and defects found during a cycle were retested after the fix.',
      cases: [
      { id: 'tc1', testId: 'TC-01', module: 'Authentication Module', scenario: 'Login with valid credentials', input: 'Registered email and correct password', expected: 'Dashboard opens', actual: 'Dashboard opens', status: 'Pass', remarks: '' },
      { id: 'tc2', testId: 'TC-02', module: 'Authentication Module', scenario: 'Login with invalid password', input: 'Registered email and wrong password', expected: 'Error message shown', actual: 'Error message shown', status: 'Pass', remarks: '' },
      { id: 'tc3', testId: 'TC-03', module: 'Exam Management Module', scenario: 'Create exam without a question set', input: 'Exam details with empty question set', expected: 'Validation message shown', actual: 'Validation message shown', status: 'Pass', remarks: '' },
      { id: 'tc4', testId: 'TC-04', module: 'Results Module', scenario: 'Evaluate a submitted attempt', input: 'Submitted answers for a published exam', expected: 'Score calculated and stored', actual: 'Score calculated and stored', status: 'Pass', remarks: '' },
      { id: 'tc5', testId: 'TC-05', module: 'Student Dashboard Module', scenario: 'View result before publication', input: 'Student opens results tab', expected: 'Result shown as pending', actual: 'Result shown as pending', status: 'Pass', remarks: '' }]

    },
    content: {
      abstract:
      'The Qubeso Exam Portal is a web based examination and result management platform developed to replace the manual, paper driven examination process followed at the institute. The system allows faculty to build reusable question banks, schedule examinations and publish results, while students attempt examinations online and view their outcome as soon as it is published. Administrators oversee users, examinations and reports from a central panel. The application is built with React and TypeScript on the client, styled with Tailwind CSS, and uses Firebase Authentication and Firebase Firestore for identity and data storage. This report documents the analysis, design, implementation and testing of the system.',
      'ch1.overview':
      'The Qubeso Exam Portal is an online examination and result management platform for a college environment. It brings the three activities that surround an examination — preparing questions, conducting the examination and publishing results — into a single application used by administrators, faculty and students.',
      'ch1.background':
      'Examinations at the institute have traditionally been conducted on paper. Question papers are prepared and printed for each subject, answer sheets are collected and evaluated manually, and marks are transferred into spreadsheets before publication. As the number of students has grown, the time and staff effort required by this process has grown with it.',
      'ch2.existing':
      'The existing system is manual. Faculty prepare question papers in a word processor, the examination section prints and distributes them, and evaluated marks are compiled by hand into spreadsheets that are later published on a notice board.',
      'ch2.problems':
      'The manual process is slow, dependent on physical presence, and prone to transcription errors when marks move between answer sheets, spreadsheets and the final marksheet. Question papers prepared in previous terms are difficult to reuse because they are not stored in a structured, searchable form.',
      'ch2.proposed':
      'The proposed system moves the entire examination workflow online. Question banks are stored as structured records, examinations are scheduled and delivered through the portal, objective answers are evaluated automatically against the stored answer key, and results become visible to students immediately after publication.',
      'ch2.advantages':
      'Evaluation of objective questions is automatic and consistent. Question banks are reusable across terms. Results are compiled without manual transcription, and administrators can monitor examination activity in real time.',
      'ch2.limitations':
      'The current version evaluates objective questions only; subjective answers still require manual review. Video proctoring and offline attempts are not supported, and a stable internet connection is required for the duration of an examination.',
      'ch3.architecture':
      'The portal follows a client and cloud backend architecture. The React client communicates directly with Firebase services. Firebase Authentication verifies the identity of the user and issues a session, while Firestore stores and serves application data under security rules that restrict each collection by role.',
      'ch3.workflow':
      'A faculty member creates a question bank and an examination, then publishes it. A student signs in, sees the published examination on the dashboard and attempts it. On submission the attempt is evaluated against the stored answer key and a result record is created. The faculty member publishes the result, after which it becomes visible to the student.',
      'ch9.results':
      'The implemented portal supports the complete examination workflow from question bank creation through to result publication. All five functional requirements identified during analysis were implemented and verified through the test cases recorded in Chapter 8.',
      'ch9.performance':
      'During testing, portal screens rendered within two seconds on a standard broadband connection, and the evaluation of a submitted attempt completed without a perceptible delay for the question volumes used in testing.',
      'ch9.achievements':
      'The project delivered a working examination platform, an automatic evaluation routine for objective questions, and a reporting view for administrators.',
      'ch10.conclusion':
      'The Qubeso Exam Portal demonstrates that the examination process followed at the institute can be moved online without changing the academic rules that govern it. The system removes the repetitive manual work around distribution, evaluation and result compilation, and gives each role a focused interface for the tasks it owns.',
      'ch10.future':
      'Future work includes evaluation support for subjective answers, analytics on question difficulty derived from attempt data, a mobile application for students, and a proctoring layer for remote examinations.',
      acknowledgement:
      'I would like to express my sincere gratitude to my guide, Prof. R. K. Sharma, for the continuous guidance and support extended throughout this project. I also thank the Head of the Department and the faculty members of the Department of Computer Engineering for providing the facilities and encouragement required to complete this work.'
    },
    formatting: {
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
      headerText: 'Qubeso Exam Portal',
      footerText: 'Gujarat Technological University',
      template: 'academic-classic'
    }
  };
  return project;
}