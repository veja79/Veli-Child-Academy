import { useEffect, useState } from 'react';
import { fetchAnnouncements } from './api/announcements';
import type { Announcement } from './types/announcement';

export function useAnnouncements() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchAnnouncements().then((data) => {
      if (active) {
        setItems(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return { items, loading };
}

export function formatDate(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
