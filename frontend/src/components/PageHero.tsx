import type { ReactNode } from 'react';

export default function PageHero({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <section className="page-hero">
      <div className="container">
        <h1>{title}</h1>
        {children && <p className="lead">{children}</p>}
      </div>
    </section>
  );
}
