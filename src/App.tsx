import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ProjectsProvider } from './contexts/ProjectsContext';
import { ToastProvider } from './components/ui/ToastProvider';
import { AppShell } from './components/layout/AppShell';
import { RequireAuth } from './components/layout/RequireAuth';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { Templates } from './pages/Templates';
import { ScreenshotsLibrary } from './pages/ScreenshotsLibrary';
import { DiagramsLibrary } from './pages/DiagramsLibrary';
import { Settings } from './pages/Settings';
import { Help } from './pages/Help';
import { Builder } from './pages/Builder';
import { ProjectWizard } from './pages/ProjectWizard';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProjectsProvider>
          <ToastProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/auth" element={<Auth />} />
                <Route
                  path="/app"
                  element={
                  <RequireAuth>
                      <AppShell />
                    </RequireAuth>
                  }>
                  
                  <Route index element={<Dashboard />} />
                  <Route path="projects" element={<Projects />} />
                  <Route path="templates" element={<Templates />} />
                  <Route path="builder" element={<Builder />} />
                  <Route path="screenshots" element={<ScreenshotsLibrary />} />
                  <Route path="diagrams" element={<DiagramsLibrary />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="help" element={<Help />} />
                </Route>
                <Route
                  path="/project/:projectId/:step"
                  element={
                  <RequireAuth>
                      <ProjectWizard />
                    </RequireAuth>
                  } />
                
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </ToastProvider>
        </ProjectsProvider>
      </AuthProvider>
    </ThemeProvider>);

}