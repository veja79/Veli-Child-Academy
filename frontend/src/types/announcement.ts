export type AnnouncementCategory = 'ANNOUNCEMENT' | 'NEWS' | 'EVENT';

/** Mirrors the public announcement returned by the Spring Boot backend. */
export interface Announcement {
  id: number;
  title: string;
  summary: string;
  body: string;
  category: AnnouncementCategory;
  /** ISO date, e.g. "2026-11-20" */
  publishedAt: string;
  pinned: boolean;
  /** Optional poster or photo, e.g. "/images/family-fun-day-2026.jpg" */
  imageUrl?: string | null;
}
