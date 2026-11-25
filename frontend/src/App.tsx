import { useEffect, type ReactNode } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AdminProvider } from './admin/AdminContext';
import AdminLogin from './admin/AdminLogin';
import AnnouncementEditor from './admin/AnnouncementEditor';
import AnnouncementsList from './admin/AnnouncementsList';
import Dashboard from './admin/Dashboard';
import Messages from './admin/Messages';
import Footer from './components/Footer';
import Header from './components/Header';
import About from './pages/About';
import Announcements from './pages/Announcements';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Privacy from './pages/Privacy';
import Register from './pages/Register';
import WhatsAppButton from './components/WhatsAppButton';
import Applications from './admin/Applications';

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const target = hash ? document.getElementById(hash.slice(1)) : null;
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function Public({ children }: { children: ReactNode }) {
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

export default function App() {
  return (
    <AdminProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Public><Home /></Public>} />
        <Route path="/about" element={<Public><About /></Public>} />
        <Route path="/announcements" element={<Public><Announcements /></Public>} />
        <Route path="/gallery" element={<Public><Gallery /></Public>} />
        <Route path="/register" element={<Public><Register /></Public>} />
        <Route path="/contact" element={<Public><Contact /></Public>} />
        <Route path="/privacy" element={<Public><Privacy /></Public>} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/announcements" element={<AnnouncementsList />} />
        <Route path="/admin/announcements/new" element={<AnnouncementEditor />} />
        <Route path="/admin/announcements/:id" element={<AnnouncementEditor />} />
        <Route path="/admin/messages" element={<Messages />} />
        <Route path="/admin/applications" element={<Applications />} />

        <Route path="*" element={<Public><NotFound /></Public>} />
      </Routes>
    </AdminProvider>
  );
}
