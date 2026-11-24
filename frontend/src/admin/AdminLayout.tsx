import { useEffect, type ReactNode } from 'react';
import { Link, Navigate, NavLink } from 'react-router-dom';
import { useAdmin } from './AdminContext';

export default function AdminLayout({ title, children }: { title: string; children: ReactNode }) {
  const { session, logout, unread, refreshUnread } = useAdmin();

  useEffect(() => {
    document.title = `${title} · Veli admin`;
  }, [title]);

  useEffect(() => {
    refreshUnread();
  }, [refreshUnread, title]);

  if (!session) return <Navigate to="/admin/login" replace />;

  const link = ({ isActive }: { isActive: boolean }) => `admin-nav__link ${isActive ? 'admin-nav__link--active' : ''}`;

  return (
    <div className="admin">
      <header className="admin-bar">
        <Link to="/admin" className="admin-bar__brand">
          <img src="/logo.png" alt="" width="36" height="37" />
          <span>Veli admin</span>
        </Link>
        <nav className="admin-nav" aria-label="Admin">
          <NavLink to="/admin" end className={link}>Dashboard</NavLink>
          <NavLink to="/admin/announcements" className={link}>News</NavLink>
          <NavLink to="/admin/messages" className={link}>
            Messages {unread > 0 && <span className="badge">{unread}</span>}
          </NavLink>
        </nav>
        <div className="admin-bar__right">
          <a href="/" target="_blank" rel="noreferrer" className="admin-bar__site">View site</a>
          <button className="btn btn--small btn--outline" onClick={logout}>Log out</button>
        </div>
      </header>
      <main className="admin-main container">
        <h1 className="admin-title">{title}</h1>
        {children}
      </main>
    </div>
  );
}
