import { formatDate } from '../hooks';
import type { Announcement } from '../types/announcement';

const labels = { ANNOUNCEMENT: 'Announcement', NEWS: 'News', EVENT: 'Event' } as const;

export default function AnnouncementCard({ item, full = false }: { item: Announcement; full?: boolean }) {
  return (
    <article className={`card announcement ${item.pinned ? 'announcement--pinned' : ''}`}>
      <div className="announcement__meta">
        <span className={`tag tag--${item.category.toLowerCase()}`}>{labels[item.category]}</span>
        {item.pinned && <span className="tag tag--pinned">Pinned</span>}
        <time dateTime={item.publishedAt}>{formatDate(item.publishedAt)}</time>
      </div>
      <h3>{item.title}</h3>
      <p>{full ? item.body : item.summary}</p>
    </article>
  );
}
