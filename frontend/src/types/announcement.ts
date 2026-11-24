export type AnnouncementCategory = 'ANNOUNCEMENT' | 'NEWS' | 'EVENT';

/** Mirrors the Announcement entity the Spring Boot backend will return. */
export interface Announcement {
  id: number;
  title: string;
  summary: string;
  body: string;
  category: AnnouncementCategory;
  /** ISO date, e.g. "2026-11-20" */
  publishedAt: string;
  pinned: boolean;
}
