import { useCallback, useEffect, useState } from 'react';
import PageHero from '../components/PageHero';
import { albums, type Photo } from '../content/gallery';

export default function Gallery() {
  const [open, setOpen] = useState<{ photos: Photo[]; index: number } | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (dir: number) =>
      setOpen((o) => (o ? { ...o, index: (o.index + dir + o.photos.length) % o.photos.length } : o)),
    [],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, close, step]);

  const current = open ? open.photos[open.index] : null;

  return (
    <>
      <PageHero title="Gallery">Excursions, themed days and everyday school life at Veli Child Academy.</PageHero>

      {albums.map((album, ai) => (
        <section key={album.id} id={album.id} className={`section ${ai % 2 ? 'section--tint' : ''}`}>
          <div className="container">
            <h2 className="section__title">{album.title}</h2>
            <p className="lead album__text">{album.text}</p>
            <div className="masonry">
              {album.photos.map((p, i) => (
                <button
                  key={p.src}
                  className={`masonry__item ${p.tall ? 'masonry__item--tall' : ''}`}
                  onClick={() => setOpen({ photos: album.photos, index: i })}
                  aria-label={`Open photo: ${p.alt}`}
                >
                  <img src={p.src} alt={p.alt} loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        </section>
      ))}

      {open && current && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={current.alt} onClick={close}>
          <button className="lightbox__close" onClick={close} aria-label="Close">×</button>
          <button className="lightbox__nav lightbox__nav--prev" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous photo">‹</button>
          <figure onClick={(e) => e.stopPropagation()}>
            <img src={current.src} alt={current.alt} />
            <figcaption>{current.alt} · {open.index + 1} of {open.photos.length}</figcaption>
          </figure>
          <button className="lightbox__nav lightbox__nav--next" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next photo">›</button>
        </div>
      )}
    </>
  );
}
