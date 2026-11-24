import { useState } from 'react';
import AnnouncementCard from '../components/AnnouncementCard';
import PageHero from '../components/PageHero';
import { useAnnouncements } from '../hooks';
import type { AnnouncementCategory } from '../types/announcement';

const filters: { value: AnnouncementCategory | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'ANNOUNCEMENT', label: 'Announcements' },
  { value: 'NEWS', label: 'News' },
  { value: 'EVENT', label: 'Events' },
];

export default function Announcements() {
  const { items, loading } = useAnnouncements();
  const [filter, setFilter] = useState<AnnouncementCategory | 'ALL'>('ALL');
  const shown = filter === 'ALL' ? items : items.filter((a) => a.category === filter);

  return (
    <>
      <PageHero title="Announcements & news">
        Notices, school news and upcoming events for parents and the community.
      </PageHero>

      <section className="section">
        <div className="container">
          <div className="filters" role="group" aria-label="Filter by type">
            {filters.map((f) => (
              <button
                key={f.value}
                className={`chip ${filter === f.value ? 'chip--active' : ''}`}
                aria-pressed={filter === f.value}
                onClick={() => setFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {loading && <p>Loading…</p>}
          {!loading && shown.length === 0 && <p>Nothing here yet. Check back soon.</p>}
          <div className="stack">
            {shown.map((a) => (
              <AnnouncementCard key={a.id} item={a} full />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
