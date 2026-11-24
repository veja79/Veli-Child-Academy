import { useEffect, type ReactNode } from 'react';

export const SITE_TITLE = 'Veli Child Academy · Ivory Park, Midrand';

/** Sets the browser tab title for the current page. */
export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · Veli Child Academy` : SITE_TITLE;
  }, [title]);
}

export default function PageHero({ title, children }: { title: string; children?: ReactNode }) {
  usePageTitle(title);
  return (
    <section className="page-hero">
      <div className="container">
        <h1>{title}</h1>
        {children && <p className="lead">{children}</p>}
      </div>
    </section>
  );
}
