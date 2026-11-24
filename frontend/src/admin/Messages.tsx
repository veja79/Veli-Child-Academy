import { useEffect, useState } from 'react';
import { adminApi, type InboxMessage } from '../api/admin';
import { telHref } from '../content/school';
import AdminLayout from './AdminLayout';
import { formatDateTime, useAdmin } from './AdminContext';

export default function Messages() {
  const { run, session, refreshUnread } = useAdmin();
  const [items, setItems] = useState<InboxMessage[] | null>(null);
  const [openId, setOpenId] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!session) return;
    run(adminApi.listMessages).then(setItems).catch((e) => setError(e.message));
  }, [run, session]);

  async function setRead(m: InboxMessage, read: boolean) {
    try {
      const updated = await run((s) => adminApi.setRead(s, m.id, read));
      setItems((list) => list?.map((x) => (x.id === m.id ? updated : x)) ?? null);
      refreshUnread();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not update.');
    }
  }

  async function open(m: InboxMessage) {
    setOpenId(openId === m.id ? null : m.id);
    if (!m.read) await setRead(m, true);
  }

  async function remove(m: InboxMessage) {
    if (!window.confirm(`Delete the message from ${m.name}?`)) return;
    try {
      await run((s) => adminApi.deleteMessage(s, m.id));
      setItems((list) => list?.filter((x) => x.id !== m.id) ?? null);
      refreshUnread();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not delete.');
    }
  }

  const shown = filter === 'unread' ? items?.filter((m) => !m.read) : items;
  const whatsapp = (phone: string) => 'https://wa.me/27' + phone.replace(/\D/g, '').replace(/^(27|0)/, '');

  return (
    <AdminLayout title="Messages">
      <div className="filters">
        <button className={`chip ${filter === 'all' ? 'chip--active' : ''}`} onClick={() => setFilter('all')}>All</button>
        <button className={`chip ${filter === 'unread' ? 'chip--active' : ''}`} onClick={() => setFilter('unread')}>
          Unread ({items?.filter((m) => !m.read).length ?? 0})
        </button>
      </div>
      {error && <p className="notice notice--error">{error}</p>}
      {items === null && !error && <p>Loading…</p>}
      {shown?.length === 0 && <p className="muted">No messages here.</p>}
      <div className="stack">
        {shown?.map((m) => (
          <article key={m.id} className={`card message ${m.read ? '' : 'message--unread'}`}>
            <button className="message__head" onClick={() => open(m)} aria-expanded={openId === m.id}>
              <span><strong>{m.name}</strong> · {m.subject}</span>
              <span className="muted">{formatDateTime(m.createdAt)}</span>
            </button>
            {openId === m.id ? (
              <div className="message__body">
                <p className="message__text">{m.message}</p>
                <p className="muted">
                  {m.email}{m.phone ? ` · ${m.phone}` : ''}
                </p>
                <div className="admin-actions">
                  <a className="btn btn--small btn--sun" href={`mailto:${m.email}?subject=${encodeURIComponent('Re: ' + m.subject)}`}>Reply by email</a>
                  {m.phone && <a className="btn btn--small btn--whatsapp" href={whatsapp(m.phone)} target="_blank" rel="noreferrer">WhatsApp</a>}
                  {m.phone && <a className="btn btn--small btn--outline" href={telHref(m.phone)}>Call</a>}
                  <button className="btn btn--small btn--outline" onClick={() => setRead(m, false)}>Mark unread</button>
                  <button className="btn btn--small btn--danger" onClick={() => remove(m)}>Delete</button>
                </div>
              </div>
            ) : (
              <p className="message__snippet">{m.message.length > 120 ? m.message.slice(0, 120) + '…' : m.message}</p>
            )}
          </article>
        ))}
      </div>
    </AdminLayout>
  );
}
