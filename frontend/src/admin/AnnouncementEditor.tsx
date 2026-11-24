import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { adminApi, ValidationError, type AnnouncementInput } from '../api/admin';
import AnnouncementCard from '../components/AnnouncementCard';
import { albums } from '../content/gallery';
import AdminLayout from './AdminLayout';
import { useAdmin } from './AdminContext';

const today = () => new Date().toISOString().slice(0, 10);

const blank = (): AnnouncementInput => ({
  title: '', summary: '', body: '', category: 'ANNOUNCEMENT', publishedAt: today(), pinned: false, published: true, imageUrl: null,
});

/** Images already on the website that can be used as a post picture. */
const siteImages = [
  '/images/family-fun-day-2026.jpg',
  '/images/bins-of-hope.jpg',
  ...albums.flatMap((a) => a.photos.map((p) => p.src)),
];

export default function AnnouncementEditor() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const { run, session } = useAdmin();
  const [form, setForm] = useState<AnnouncementInput>(blank);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [fields, setFields] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isNew || !session) return;
    run((s) => adminApi.getAnnouncement(s, Number(id)))
      .then(({ title, summary, body, category, publishedAt, pinned, published, imageUrl }) =>
        setForm({ title, summary, body, category, publishedAt, pinned, published, imageUrl }))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id, isNew, run, session]);

  function set<K extends keyof AnnouncementInput>(key: K, value: AnnouncementInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setFields({});
    try {
      const input = { ...form, imageUrl: form.imageUrl?.trim() || null };
      if (isNew) await run((s) => adminApi.createAnnouncement(s, input));
      else await run((s) => adminApi.updateAnnouncement(s, Number(id), input));
      navigate('/admin/announcements');
    } catch (err) {
      if (err instanceof ValidationError) setFields(err.fields);
      setError(err instanceof Error ? err.message : 'Could not save.');
    } finally {
      setSaving(false);
    }
  }

  const fieldError = (name: string) => fields[name] && <span className="field-error">{fields[name]}</span>;

  return (
    <AdminLayout title={isNew ? 'New post' : 'Edit post'}>
      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="editor">
          <form className="card form" onSubmit={onSubmit}>
            <label>
              Title *
              <input value={form.title} maxLength={150} required onChange={(e) => set('title', e.target.value)} />
              {fieldError('title')}
            </label>
            <label>
              Short summary * <span className="hint">Shown on the home page ({form.summary.length}/300)</span>
              <input value={form.summary} maxLength={300} required onChange={(e) => set('summary', e.target.value)} />
              {fieldError('summary')}
            </label>
            <label>
              Full text * <span className="hint">Shown on the News page</span>
              <textarea rows={7} value={form.body} maxLength={5000} required onChange={(e) => set('body', e.target.value)} />
              {fieldError('body')}
            </label>
            <div className="form__row">
              <label>
                Type
                <select value={form.category} onChange={(e) => set('category', e.target.value as AnnouncementInput['category'])}>
                  <option value="ANNOUNCEMENT">Announcement</option>
                  <option value="NEWS">News</option>
                  <option value="EVENT">Event</option>
                </select>
              </label>
              <label>
                Date <span className="hint">Future dates stay hidden until then</span>
                <input type="date" value={form.publishedAt} required onChange={(e) => set('publishedAt', e.target.value)} />
                {fieldError('publishedAt')}
              </label>
            </div>
            <label>
              Picture or poster <span className="hint">Optional. Pick a website photo or paste an image link</span>
              <input list="site-images" value={form.imageUrl ?? ''} placeholder="/images/…" onChange={(e) => set('imageUrl', e.target.value)} />
              <datalist id="site-images">
                {siteImages.map((src) => <option key={src} value={src} />)}
              </datalist>
              {fieldError('imageUrl')}
            </label>
            <label className="form__check">
              <input type="checkbox" checked={form.pinned} onChange={(e) => set('pinned', e.target.checked)} />
              <span>Pin to the top</span>
            </label>
            <label className="form__check">
              <input type="checkbox" checked={!form.published} onChange={(e) => set('published', !e.target.checked)} />
              <span>Save as draft (hidden from the website)</span>
            </label>
            {error && <p className="notice notice--error" role="alert">{error}</p>}
            <div className="admin-actions">
              <button className="btn btn--sun" disabled={saving}>{saving ? 'Saving…' : form.published ? 'Publish' : 'Save draft'}</button>
              <Link to="/admin/announcements" className="btn btn--outline">Cancel</Link>
            </div>
          </form>

          <aside>
            <p className="hint">Preview</p>
            <AnnouncementCard
              item={{ id: 0, ...form, title: form.title || 'Your title', summary: form.summary || 'Your summary', body: form.body || 'Your full text' }}
              full
            />
          </aside>
        </div>
      )}
    </AdminLayout>
  );
}
