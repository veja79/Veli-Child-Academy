import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi, type AdminAnnouncement, type InboxMessage } from '../api/admin';
import AdminLayout from './AdminLayout';
import { formatDateTime, useAdmin } from './AdminContext';

export default function Dashboard() {
  const { run, session, newApplications } = useAdmin();
  const [posts, setPosts] = useState<AdminAnnouncement[] | null>(null);
  const [messages, setMessages] = useState<InboxMessage[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!session) return;
    Promise.all([run(adminApi.listAnnouncements), run(adminApi.listMessages)])
      .then(([a, m]) => {
        setPosts(a);
        setMessages(m);
      })
      .catch((e) => setError(e.message));
  }, [run, session]);

  const unread = messages?.filter((m) => !m.read) ?? [];
  const drafts = posts?.filter((p) => !p.published).length ?? 0;

  return (
    <AdminLayout title={`Welcome, ${session?.username ?? ''}`}>
      {error && <p className="notice notice--error">{error}</p>}
      <div className="grid grid--4 admin-stats">
        <Link to="/admin/applications" className="card stat">
          <span className="stat__value">{newApplications}</span>
          <span className="stat__label">New applications</span>
        </Link>
        <Link to="/admin/messages" className="card stat">
          <span className="stat__value">{messages ? unread.length : '…'}</span>
          <span className="stat__label">Unread messages</span>
        </Link>
        <Link to="/admin/announcements" className="card stat">
          <span className="stat__value">{posts ? posts.length - drafts : '…'}</span>
          <span className="stat__label">Published posts</span>
        </Link>
        <Link to="/admin/announcements" className="card stat">
          <span className="stat__value">{posts ? drafts : '…'}</span>
          <span className="stat__label">Drafts</span>
        </Link>
      </div>

      <div className="admin-actions">
        <Link to="/admin/announcements/new" className="btn btn--sun">+ New post</Link>
        <Link to="/admin/messages" className="btn btn--outline">Read messages</Link>
      </div>

      <h2 className="admin-subtitle">Latest messages</h2>
      {messages && messages.length === 0 && <p className="muted">No messages yet.</p>}
      <div className="stack">
        {messages?.slice(0, 3).map((m) => (
          <Link key={m.id} to="/admin/messages" className={`card msg-preview ${m.read ? '' : 'msg-preview--unread'}`}>
            <strong>{m.name}</strong> · {m.subject}
            <span className="muted"> · {formatDateTime(m.createdAt)}</span>
            <p>{m.message.length > 140 ? m.message.slice(0, 140) + '…' : m.message}</p>
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
}
