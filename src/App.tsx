/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { useRouter } from './hooks/useRouter';
import { AppShell } from './components/layout/AppShell';

// Pages
import { Home } from './pages/Home';
import { Courses } from './pages/Courses';
import { CourseDetail } from './pages/CourseDetail';
import { Professors } from './pages/Professors';
import { ProfessorDetail } from './pages/ProfessorDetail';
import { Auth } from './pages/Auth';
import { Profile } from './pages/Profile';

function AppContent() {
  const { view, params, navigate } = useRouter();

  const renderActiveView = () => {
    switch (view) {
      case 'home':
        return <Home onNavigate={navigate} />;
      case 'courses':
        return <Courses onNavigate={navigate} />;
      case 'course-detail':
        return <CourseDetail courseId={params.id || ''} onNavigate={navigate} />;
      case 'professors':
        return <Professors onNavigate={navigate} />;
      case 'professor-detail':
        return <ProfessorDetail professorId={params.id || ''} onNavigate={navigate} />;
      case 'auth':
        return <Auth onNavigate={navigate} />;
      case 'profile':
        return <Profile onNavigate={navigate} />;
      default:
        return <Home onNavigate={navigate} />;
    }
  };

  return (
    <AppShell currentView={view} onNavigate={navigate}>
      {renderActiveView()}
    </AppShell>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
