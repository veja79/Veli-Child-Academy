import PageHero from '../components/PageHero';
import { school } from '../content/school';

export default function About() {
  const { about } = school;

  return (
    <>
      <PageHero title="About the school">{about.story}</PageHero>

      <section className="section">
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

      <section className="section section--tint">
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

      <section className="section">
        <div className="container">
          <h2 className="section__title">Age groups</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Class</th>
                <th>Ages</th>
                <th>Focus</th>
              </tr>
            </thead>
            <tbody>
              {school.programmes.map((p) => (
                <tr key={p.name}>
                  <td>{p.name}</td>
                  <td>{p.ages}</td>
                  <td>{p.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
