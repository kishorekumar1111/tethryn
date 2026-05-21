/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { AppProvider } from './core/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import GalleryPage from './pages/GalleryPage';
import BuilderPage from './pages/BuilderPage';
import DashboardPage from './pages/DashboardPage';
import ViewPage from './pages/ViewPage';
import AdminPage from './pages/AdminPage';
import LegalPage from './pages/LegalPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import AuthGuard from './components/AuthGuard';
import CustomCursor from './components/CustomCursor';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <ScrollToTop />
          <Toaster position="top-center" richColors />
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/legal" element={<LegalPage />} />
              
              <Route path="/builder" element={
                <AuthGuard>
                  <BuilderPage />
                </AuthGuard>
              } />
              <Route path="/dashboard" element={
                <AuthGuard>
                  <DashboardPage />
                </AuthGuard>
              } />
              
              <Route path="/view/:id" element={<ViewPage />} />
              <Route path="/t/:slug" element={<ViewPage />} />
              <Route path="/admin" element={<AdminPage />} />
              
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          {/* Hide footer on builder page for a true app experience */}
          <FooterWrapper />
          <CursorWrapper />
        </div>
      </Router>
    </AppProvider>
  );
}

function FooterWrapper() {
  const location = useLocation();
  const isBuilder = location.pathname.startsWith('/builder');
  if (isBuilder) return null;
  return <Footer />;
}

function CursorWrapper() {
  const location = useLocation();
  const isBuilderOrView = location.pathname.startsWith('/builder') || location.pathname.startsWith('/view') || location.pathname.startsWith('/t/');
  if (isBuilderOrView) return null;
  return <CustomCursor />;
}
