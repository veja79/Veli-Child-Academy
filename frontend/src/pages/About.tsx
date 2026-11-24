import PageHero from '../components/PageHero';
import { aboutPhoto, uniformPhotos } from '../content/gallery';
import { school } from '../content/school';

export default function About() {
  const { about } = school;

  return (
    <>
      <PageHero title="About Veli Child Academy">{school.motto}. {school.tagline}.</PageHero>

      <section className="section">
        <div className="container split">
          <div>
            <h2>Who we are</h2>
            <p className="lead">{about.story}</p>
            <p>
              We offer Grade R to Grade 3, robotics and computer classes, swimming lessons, and after-school extra classes for
              Grades 1 to 12, at {school.address.slice(0, 2).join(', ')}.
            </p>
          </div>
          <figure className="split__figure">
            <img className="split__photo" src={aboutPhoto} alt="Veli Child Academy learners in summer uniform" loading="lazy" />
            <figcaption>Photo: Tshepo_Shoots</figcaption>
          </figure>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container grid grid--2">
          <div className="card card--accent">
            <h2>Our mission</h2>
            <p>{about.mission}</p>
          </div>
          <div className="card card--accent">
            <h2>Our vision</h2>
            <p>{about.vision}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section__title">What we value</h2>
          <div className="grid grid--4">
            {about.values.map((v) => (
              <div key={v.title} className="card">
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container split">
          <div>
            <h2>School uniform</h2>
            <p>
              Learners wear a grey golf shirt with navy shorts or blue jeans, a navy jersey in winter, a grey and
              navy tracksuit, and black school shoes. All items carry the Veli Child Academy logo.
            </p>
            <p>Contact the school to find out where to buy uniform items.</p>
          </div>
          <div className="photo-pair">
            {uniformPhotos.map((p) => (
              <img key={p.src} src={p.src} alt={p.alt} loading="lazy" />
            ))}
          </div>
        </div>
      </section>

      {school.partners.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="section__title">Our partners</h2>
            <p className="lead">Organisations that support our learners and community.</p>
            <div className="grid grid--3">
              {school.partners.map((p) => (
                <div key={p.name} className="card partner">
                  {p.logo ? (
                    <img src={p.logo} alt={`${p.name} logo`} className="partner__logo" loading="lazy" />
                  ) : (
                    <div className="partner__initials" aria-hidden="true">
                      {p.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                    </div>
                  )}
                  <div>
                    <h3>{p.name}</h3>
                    <p>{p.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
