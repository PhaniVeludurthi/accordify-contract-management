import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import Layout from '@/components/layout/Layout';
import LoginPage from '@/pages/auth/LoginPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import ProjectsListPage from '@/pages/projects/ProjectsListPage';
import CreateProjectPage from '@/pages/projects/CreateProjectPage';
import EditProjectPage from '@/pages/projects/EditProjectPage';
import ProjectDetailPage from '@/pages/projects/ProjectDetailPage';
import DocumentLibraryPage from '@/pages/documents/DocumentLibraryPage';
import DocumentViewerPage from '@/pages/documents/DocumentViewerPage';
import CollaborativeEditorPage from '@/pages/documents/CollaborativeEditorPage';
import ClauseLibraryPage from '@/pages/documents/ClauseLibraryPage';

function App() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        
        {/* Projects Routes */}
        <Route path="/projects" element={<ProjectsListPage />} />
        <Route path="/projects/new" element={<CreateProjectPage />} />
        <Route path="/projects/:id/edit" element={<EditProjectPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        
        {/* Documents Routes */}
        <Route path="/documents" element={<DocumentLibraryPage />} />
        <Route path="/documents/:id" element={<DocumentViewerPage />} />
        <Route path="/documents/:id/edit" element={<CollaborativeEditorPage />} />
        <Route path="/clauses" element={<ClauseLibraryPage />} />
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;