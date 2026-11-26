import type { Announcement } from '../types/announcement';
import { API_BASE } from '../config';


/**
 * Sample data shown until the Spring Boot backend is running.
 * Remove once GET /api/announcements is live.
 */
const SAMPLE: Announcement[] = [
  {
    id: 1,
    title: 'Registrations open: Grade R to Grade 3',
    summary: 'Grade R, 1, 2 and 3 registrations are now open. Call 060 666 2087 to register.',
    body: 'Give your child a better future. Registrations are open for Grade R, Grade 1, Grade 2 and Grade 3 at 12498 Khoza Street, Ivory Park. Call 060 666 2087 or 071 646 3498, or send us a message through the contact page.',
    category: 'ANNOUNCEMENT',
    publishedAt: '2026-11-24',
    pinned: true,
  },
  {
    id: 2,
    title: 'Ivory Park Family Fun Day moved to Saturday 5 December',
    summary:
      'The Ivory Park Family Fun Day has moved from 24 November to Saturday 5 December 2026 at Mhlangu Sports Ground, Ema 7, so our matric learners can join us after their exams. Tickets from R70.',
    body: 'Please note that the 4th annual Ivory Park Family Fun Day, presented by Veli Child Academy and SHEBBA Media, has been moved from the previously communicated date of 24 November 2026 to Saturday 5 December 2026. We moved the date because our matric learners were still writing their final exams. They finished this week, so now everyone can celebrate together. Congratulations to all our matriculants! Venue: Mhlangu Sports Ground, Ema 7 (Bidebaggeme Rd, Ivory Park, Johannesburg). Tickets: kids R80, adults R70. Family combo of 2 adults and 1 child R170, or 2 adults and 2 kids R200. The indigenous games tournament is on, with a R50 registration fee and prizes of R500, R200 and R100. Tickets already bought stay valid for the new date. To pre-order, call +27 60 666 2087. Bring your camp chairs and umbrellas!',
    category: 'EVENT',
    publishedAt: '2026-11-26',
    pinned: true,
    imageUrl: '/images/family-fun-day-2026.jpg',
  },
  {
    id: 3,
    title: 'Bins of Hope donation drive',
    summary: 'Help us collect school shoes, uniforms, clothing and sanitary pads for children in need.',
    body: 'At the Ivory Park Family Fun Day we are collecting donations of school shoes, sanitary pads, clothing, shoes and school uniforms. To donate, call 060 666 2087.',
    category: 'NEWS',
    publishedAt: '2026-11-24',
    pinned: false,
    imageUrl: '/images/bins-of-hope.jpg',
  },
  {
    id: 4,
    title: 'New: robotics and computer classes',
    summary: 'Robotics, computer literacy and computer numeracy are now part of learning at Veli.',
    body: 'Our learners can now take robotics, computer literacy and computer numeracy classes, building the digital skills they need for the future. Contact us to find out more.',
    category: 'NEWS',
    publishedAt: '2026-11-24',
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
