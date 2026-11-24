import { Link } from 'react-router-dom';
import AnnouncementCard from '../components/AnnouncementCard';
import { school } from '../content/school';
import { useAnnouncements } from '../hooks';

export default function Home() {
  const { items, loading } = useAnnouncements();
  const latest = items.slice(0, 3);

  return (
    <>
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__text">
            <p className="eyebrow">Now enrolling for 2027</p>
            <h1>{school.tagline}</h1>
            <p className="lead">{school.intro}</p>
            <div className="hero__actions">
              <Link to="/contact" className="btn btn--sun">Book a visit</Link>
              <Link to="/about" className="btn btn--ghost">About the school</Link>
            </div>
          </div>
          <div className="hero__art" aria-hidden="true">
            <div className="blob blob--sun" />
            <div className="blob blob--sky" />
            <div className="blob blob--coral" />
            <div className="hero__badge">
              <strong>{school.programmes.length}</strong>
              <span>age groups</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section__title">Our programmes</h2>
          <div className="grid grid--4">
            {school.programmes.map((p, i) => (
              <div key={p.name} className={`card programme programme--${i % 4}`}>
                <h3>{p.name}</h3>
                <p className="programme__ages">{p.ages}</p>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <div className="section__head">
            <h2 className="section__title">Latest announcements</h2>
            <Link to="/announcements" className="link-arrow">See all</Link>
          </div>
          {loading ? (
            <p>Loading…</p>
          ) : (
            <div className="grid grid--3">
              {latest.map((a) => (
                <AnnouncementCard key={a.id} item={a} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container cta">
          <div>
            <h2>Come and see us</h2>
            <p>Visits are the best way to get a feel for the school. Book a time that suits you.</p>
          </div>
          <Link to="/contact" className="btn btn--sun">Contact the school</Link>
        </div>
      </section>
    </>
  );
}
