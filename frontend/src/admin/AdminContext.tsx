import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { adminApi, clearSession, loadSession, login as apiLogin, UnauthorizedError, type Session } from '../api/admin';

interface AdminState {
  session: Session | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  /** Runs an API call; logs out automatically if the session has expired. */
  run: <T>(fn: (s: Session) => Promise<T>) => Promise<T>;
  /** Number of unread contact messages, shown as a badge. */
  unread: number;
  refreshUnread: () => void;
}

const Ctx = createContext<AdminState | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => loadSession());

  const logout = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    setSession(await apiLogin(username, password));
  }, []);

  const run = useCallback(
    async <T,>(fn: (s: Session) => Promise<T>) => {
      if (!session) throw new UnauthorizedError('Please log in.');
      try {
        return await fn(session);
      } catch (e) {
        if (e instanceof UnauthorizedError) setSession(null);
        throw e;
      }
    },
    [session],
  );

  const [unread, setUnread] = useState(0);
  const refreshUnread = useCallback(() => {
    if (!session) return;
    adminApi.unreadCount(session).then((r) => setUnread(r.unread)).catch(() => {});
  }, [session]);

  return <Ctx.Provider value={{ session, login, logout, run, unread, refreshUnread }}>{children}</Ctx.Provider>;
}

export function useAdmin() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAdmin must be used inside AdminProvider');
  return ctx;
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
