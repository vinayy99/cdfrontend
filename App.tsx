import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import DiscoverPage from './pages/DiscoverPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import SkillSwapPage from './pages/SkillSwapPage';
import CreateProjectPage from './pages/CreateProjectPage';
import EditProfilePage from './pages/EditProfilePage';
import Footer from './components/Footer';

const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { currentUser } = useAppContext();
  return currentUser ? children : <Navigate to="/auth" />;
};

function AppContent() {
  const { currentUser } = useAppContext();
  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={currentUser ? <Navigate to="/dashboard" /> : <LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/discover" element={<PrivateRoute><DiscoverPage /></PrivateRoute>} />
            <Route path="/projects/new" element={<PrivateRoute><CreateProjectPage /></PrivateRoute>} />
            <Route path="/profile/edit" element={<PrivateRoute><EditProfilePage /></PrivateRoute>} />
            <Route path="/project/:id" element={<PrivateRoute><ProjectDetailPage /></PrivateRoute>} />
            <Route path="/skill-swaps" element={<PrivateRoute><SkillSwapPage /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}



