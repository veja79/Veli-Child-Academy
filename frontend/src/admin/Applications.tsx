import { useEffect, useState } from 'react';
import { adminApi, type AdminApplication, type ApplicationStatus } from '../api/admin';
import { telHref } from '../content/school';
import { formatDate } from '../hooks';
import AdminLayout from './AdminLayout';
import { formatDateTime, useAdmin } from './AdminContext';

const statuses: { value: ApplicationStatus; label: string }[] = [
  { value: 'NEW', label: 'New' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'ACCEPTED', label: 'Accepted' },
  { value: 'WAITLIST', label: 'Waiting list' },
  { value: 'DECLINED', label: 'Declined' },
];
const label = (s: ApplicationStatus) => statuses.find((x) => x.value === s)?.label ?? s;

function ageOn(birth: string, year: number) {
  // Age on 1 January of the year the child would start
  const b = new Date(birth + 'T00:00:00');
  let age = year - b.getFullYear();
  if (b.getMonth() > 0 || b.getDate() > 1) age -= 1;
  return age;
}

export default function Applications() {
  const { run, session, refreshUnread } = useAdmin();
  const [items, setItems] = useState<AdminApplication[] | null>(null);
  const [filter, setFilter] = useState<ApplicationStatus | 'ALL'>('ALL');
  const [openId, setOpenId] = useState<number | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!session) return;
    run(adminApi.listApplications).then(setItems).catch((e) => setError(e.message));
  }, [run, session]);

  async function setStatus(a: AdminApplication, status: ApplicationStatus) {
    try {
      const updated = await run((s) => adminApi.setApplicationStatus(s, a.id, status));
      setItems((list) => list?.map((x) => (x.id === a.id ? updated : x)) ?? null);
      refreshUnread();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not update.');
    }
  }

  async function remove(a: AdminApplication) {
    if (!window.confirm(`Delete the application for ${a.childFirstName} ${a.childLastName}? This cannot be undone.`)) return;
    try {
      await run((s) => adminApi.deleteApplication(s, a.id));
      setItems((list) => list?.filter((x) => x.id !== a.id) ?? null);
      refreshUnread();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not delete.');
    }
  }

  const count = (s: ApplicationStatus) => items?.filter((a) => a.status === s).length ?? 0;
  const shown = filter === 'ALL' ? items : items?.filter((a) => a.status === filter);
  const whatsapp = (phone: string) => 'https://wa.me/27' + phone.replace(/\D/g, '').replace(/^(27|0)/, '');

  return (
    <AdminLayout title="Applications">
      <div className="filters">
        <button className={`chip ${filter === 'ALL' ? 'chip--active' : ''}`} onClick={() => setFilter('ALL')}>
          All ({items?.length ?? 0})
        </button>
        {statuses.map((s) => (
          <button key={s.value} className={`chip ${filter === s.value ? 'chip--active' : ''}`} onClick={() => setFilter(s.value)}>
            {s.label} ({count(s.value)})
          </button>
        ))}
      </div>
      {error && <p className="notice notice--error">{error}</p>}
      {items === null && !error && <p>Loading…</p>}
      {shown?.length === 0 && <p className="muted">No applications here.</p>}

      <div className="stack">
        {shown?.map((a) => (
          <article key={a.id} className={`card message ${a.status === 'NEW' ? 'message--unread' : ''}`}>
            <button className="message__head" onClick={() => setOpenId(openId === a.id ? null : a.id)} aria-expanded={openId === a.id}>
              <span>
                <strong>{a.childFirstName} {a.childLastName}</strong> · {a.grade} {a.startYear}
                {' '}<span className={`tag tag--app-${a.status.toLowerCase()}`}>{label(a.status)}</span>
              </span>
              <span className="muted">#{a.id} · {formatDateTime(a.createdAt)}</span>
            </button>

            {openId === a.id && (
              <div className="message__body">
                <dl className="details">
                  <dt>Date of birth</dt>
                  <dd>{formatDate(a.childBirthDate)} (age {ageOn(a.childBirthDate, a.startYear)} on 1 Jan {a.startYear})</dd>
                  {a.previousSchool && <><dt>Current school</dt><dd>{a.previousSchool}</dd></>}
                  <dt>Parent / guardian</dt>
                  <dd>{a.parentName} ({a.relationship})</dd>
                  <dt>Phone</dt>
                  <dd>{a.phone}</dd>
                  {a.email && <><dt>Email</dt><dd>{a.email}</dd></>}
                  {a.address && <><dt>Address</dt><dd>{a.address}</dd></>}
                  {a.notes && <><dt>Notes</dt><dd className="message__text">{a.notes}</dd></>}
                </dl>

                <label className="status-select">
                  Status
                  <select value={a.status} onChange={(e) => setStatus(a, e.target.value as ApplicationStatus)}>
                    {statuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </label>

                <div className="admin-actions">
                  <a className="btn btn--small btn--sun" href={telHref(a.phone)}>Call</a>
                  <a className="btn btn--small btn--whatsapp" href={whatsapp(a.phone)} target="_blank" rel="noreferrer">WhatsApp</a>
                  {a.email && <a className="btn btn--small btn--outline" href={`mailto:${a.email}?subject=${encodeURIComponent(`Application for ${a.childFirstName} (#${a.id})`)}`}>Email</a>}
                  <button className="btn btn--small btn--danger" onClick={() => remove(a)}>Delete</button>
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    </AdminLayout>
  );
}
