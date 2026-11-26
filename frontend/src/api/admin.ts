import type { AnnouncementCategory } from '../types/announcement';
import { API_BASE } from '../config';

const TOKEN_KEY = 'veli-admin-token';

export interface Session {
  token: string;
  expiresAt: string;
  username: string;
}

export interface AdminAnnouncement {
  id: number;
  title: string;
  summary: string;
  body: string;
  category: AnnouncementCategory;
  publishedAt: string;
  pinned: boolean;
  published: boolean;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export type AnnouncementInput = Omit<AdminAnnouncement, 'id' | 'createdAt' | 'updatedAt'>;

export interface InboxMessage {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export type ApplicationStatus = 'NEW' | 'CONTACTED' | 'ACCEPTED' | 'WAITLIST' | 'DECLINED';

export interface AdminApplication {
  id: number;
  childFirstName: string;
  childLastName: string;
  childBirthDate: string;
  grade: string;
  startYear: number;
  previousSchool: string | null;
  parentName: string;
  relationship: string;
  phone: string;
  email: string | null;
  address: string | null;
  notes: string | null;
  status: ApplicationStatus;
  createdAt: string;
}

/** Thrown when the session has expired or the token was rejected. */
export class UnauthorizedError extends Error {}

/** Field errors returned by the backend's validation handler. */
export class ValidationError extends Error {
  constructor(public fields: Record<string, string>) {
    super('Please check the highlighted fields');
  }
}

export function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Session;
    if (new Date(s.expiresAt).getTime() <= Date.now()) {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
    return s;
  } catch {
    return null;
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage unavailable */
  }
}

export async function login(username: string, password: string): Promise<Session> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
  } catch {
    throw new Error('The school server could not be reached. Check your internet connection and try again.');
  }
  if (res.status === 401) throw new Error('Incorrect username or password.');
  if (!res.ok) throw new Error('The school server is not available right now. Please try again later.');
  const body = (await res.json()) as { token: string; expiresAt: string };
  const session: Session = { ...body, username };
  try {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(session));
  } catch {
    /* session still works for this page view */
  }
  return session;
}

async function request<T>(session: Session, path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      Authorization: `Bearer ${session.token}`,
      ...init.headers,
    },
  });
  if (res.status === 401) {
    clearSession();
    throw new UnauthorizedError('Your session has expired. Please log in again.');
  }
  if (res.status === 400) {
    const body = await res.json().catch(() => ({}));
    throw new ValidationError(body.fields ?? {});
  }
  if (!res.ok) throw new Error(`Something went wrong (error ${res.status}). Please try again.`);
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const adminApi = {
  listAnnouncements: (s: Session) => request<AdminAnnouncement[]>(s, '/admin/announcements'),
  getAnnouncement: (s: Session, id: number) => request<AdminAnnouncement>(s, `/admin/announcements/${id}`),
  createAnnouncement: (s: Session, input: AnnouncementInput) =>
    request<AdminAnnouncement>(s, '/admin/announcements', { method: 'POST', body: JSON.stringify(input) }),
  updateAnnouncement: (s: Session, id: number, input: AnnouncementInput) =>
    request<AdminAnnouncement>(s, `/admin/announcements/${id}`, { method: 'PUT', body: JSON.stringify(input) }),
  deleteAnnouncement: (s: Session, id: number) =>
    request<void>(s, `/admin/announcements/${id}`, { method: 'DELETE' }),

  listMessages: (s: Session) => request<InboxMessage[]>(s, '/admin/messages'),
  unreadCount: (s: Session) => request<{ unread: number }>(s, '/admin/messages/unread-count'),
  setRead: (s: Session, id: number, read: boolean) =>
    request<InboxMessage>(s, `/admin/messages/${id}`, { method: 'PATCH', body: JSON.stringify({ read }) }),
  deleteMessage: (s: Session, id: number) => request<void>(s, `/admin/messages/${id}`, { method: 'DELETE' }),

  listApplications: (s: Session) => request<AdminApplication[]>(s, '/admin/applications'),
  newApplicationCount: (s: Session) => request<{ new: number }>(s, '/admin/applications/new-count'),
  setApplicationStatus: (s: Session, id: number, status: ApplicationStatus) =>
    request<AdminApplication>(s, `/admin/applications/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteApplication: (s: Session, id: number) => request<void>(s, `/admin/applications/${id}`, { method: 'DELETE' }),
};
