import type { Announcement } from '../types/announcement';

const API_BASE = import.meta.env.VITE_API_BASE ?? '/api';

/**
 * Sample data shown until the Spring Boot backend is running.
 * Remove once GET /api/announcements is live.
 */
const SAMPLE: Announcement[] = [
  {
    id: 1,
    title: '2027 enrolments are open',
    summary: 'Applications for all age groups are now open. Space is limited.',
    body: 'Applications for 2027 are now open for all age groups. Contact the office or use the contact form to request an application pack and book a visit.',
    category: 'ANNOUNCEMENT',
    publishedAt: '2026-11-20',
    pinned: true,
  },
  {
    id: 2,
    title: 'End-of-year concert',
    summary: 'Join us for our annual concert and Grade R graduation.',
    body: 'Families are invited to our end-of-year concert and Grade R graduation. Date and venue details will be sent home with each child.',
    category: 'EVENT',
    publishedAt: '2026-11-15',
    pinned: false,
  },
  {
    id: 3,
    title: 'New outdoor play area',
    summary: 'Our learners are enjoying the new jungle gym and sandpit.',
    body: 'Thanks to the support of our parents, the new outdoor play area is complete. Children now have more space to climb, dig and explore.',
    category: 'NEWS',
    publishedAt: '2026-10-30',
    pinned: false,
  },
];

function sortAnnouncements(items: Announcement[]): Announcement[] {
  return [...items].sort(
    (a, b) => Number(b.pinned) - Number(a.pinned) || b.publishedAt.localeCompare(a.publishedAt),
  );
}

export async function fetchAnnouncements(): Promise<Announcement[]> {
  try {
    const res = await fetch(`${API_BASE}/announcements`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return sortAnnouncements((await res.json()) as Announcement[]);
  } catch {
    // Backend not running yet: fall back to sample data so the site still works.
    return sortAnnouncements(SAMPLE);
  }
}

export interface ContactMessage {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  consent: boolean;
}

export async function sendContactMessage(msg: ContactMessage): Promise<void> {
  const res = await fetch(`${API_BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(msg),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}
