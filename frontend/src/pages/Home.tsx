import { Link } from 'react-router-dom';
import AnnouncementCard from '../components/AnnouncementCard';
import { heroPhoto, highlights, welcomePhoto } from '../content/gallery';
import { school, telHref } from '../content/school';
import { useAnnouncements } from '../hooks';
import { usePageTitle } from '../components/PageHero';

export default function Home() {
  usePageTitle();
  const { items, loading } = useAnnouncements();
  const latest = items.slice(0, 3);

  return (
    <>
      <section className="hero">
        <img className="hero__photo" src={heroPhoto} alt="Veli Child Academy learners on an excursion to an aviation museum" />
        <div className="hero__shade" />
        <div className="container hero__inner">
          <p className="eyebrow">Registrations open · Grade R to Grade 3</p>
          <h1>{school.tagline}</h1>
          <p className="lead">{school.intro}</p>
          <div className="hero__actions">
            <Link to="/contact" className="btn btn--sun">Register your child</Link>
            <a href={telHref(school.phones[0])} className="btn btn--light">Call {school.phones[0]}</a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <h2>{school.motto}</h2>
            <p className="lead">{school.about.story}</p>
            <Link to="/about" className="link-arrow">More about the school</Link>
          </div>
          <img className="split__photo" src={welcomePhoto} alt="Learners in winter uniform at the school gate" loading="lazy" />
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <h2 className="section__title">Grades we offer</h2>
          <div className="grid grid--4">
            {school.grades.map((g, i) => (
              <div key={g.name} className={`card programme programme--${i % 4}`}>
                <h3>{g.name}</h3>
                <p>{g.text}</p>
              </div>
            ))}
          </div>

          <h2 className="section__title section__title--spaced">Beyond the classroom</h2>
          <div className="grid grid--4">
            {school.extras.map((e) => (
              <div key={e.name} className="card extra">
                {e.badge && <span className="tag tag--new">{e.badge}</span>}
                <h3>{e.name}</h3>
                <p>{e.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section__head">
            <h2 className="section__title">News &amp; events</h2>
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

      <section className="section section--tint">
        <div className="container">
          <div className="section__head">
            <h2 className="section__title">Life at Veli</h2>
            <Link to="/gallery" className="link-arrow">View gallery</Link>
          </div>
          <div className="grid grid--3">
            {highlights.map((h) => (
              <Link key={h.title} to={`/gallery#${h.album}`} className="photo-card">
                <img src={h.src} alt="" loading="lazy" />
                <div className="photo-card__text">
                  <h3>{h.title}</h3>
                  <p>{h.text}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container cta">
          <div>
            <h2>Give your child a better future</h2>
            <p>Visit us at {school.address.slice(0, 2).join(', ')} or call {school.phones.join(' / ')}.</p>
          </div>
          <Link to="/contact" className="btn btn--sun">Contact the school</Link>
        </div>
      </section>
    </>
  );
}
