import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi, type AdminAnnouncement } from '../api/admin';
import { formatDate } from '../hooks';
import AdminLayout from './AdminLayout';
import { useAdmin } from './AdminContext';

export default function AnnouncementsList() {
  const { run, session } = useAdmin();
  const [items, setItems] = useState<AdminAnnouncement[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!session) return;
    run(adminApi.listAnnouncements).then(setItems).catch((e) => setError(e.message));
  }, [run, session]);

  async function remove(a: AdminAnnouncement) {
    if (!window.confirm(`Delete "${a.title}"? This cannot be undone.`)) return;
    try {
      await run((s) => adminApi.deleteAnnouncement(s, a.id));
      setItems((list) => list?.filter((x) => x.id !== a.id) ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not delete.');
    }
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <AdminLayout title="News & announcements">
      <div className="admin-actions">
        <Link to="/admin/announcements/new" className="btn btn--sun">+ New post</Link>
      </div>
      {error && <p className="notice notice--error">{error}</p>}
      {items === null && !error && <p>Loading…</p>}
      {items?.length === 0 && <p className="muted">No posts yet. Create the first one.</p>}
      <div className="stack">
        {items?.map((a) => {
          const status = !a.published ? 'Draft' : a.publishedAt > today ? 'Scheduled' : 'Live';
          return (
            <div key={a.id} className="card admin-row">
              {a.imageUrl && <img src={a.imageUrl} alt="" className="admin-row__thumb" />}
              <div className="admin-row__body">
                <div className="announcement__meta">
                  <span className={`tag tag--status-${status.toLowerCase()}`}>{status}</span>
                  {a.pinned && <span className="tag tag--pinned">Pinned</span>}
                  <span>{formatDate(a.publishedAt)}</span>
                </div>
                <h3>{a.title}</h3>
                <p className="muted">{a.summary}</p>
              </div>
              <div className="admin-row__actions">
                <Link to={`/admin/announcements/${a.id}`} className="btn btn--small btn--outline">Edit</Link>
                <button className="btn btn--small btn--danger" onClick={() => remove(a)}>Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}
