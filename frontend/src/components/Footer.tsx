import { Link } from 'react-router-dom';
import { school } from '../content/school';

export default function Footer() {
  const year = new Date().getFullYear();
  const socials = Object.entries(school.social).filter(([, url]) => url);

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <p className="footer__brand">{school.name}</p>
          <p>{school.tagline}</p>
        </div>
        <div>
          <p className="footer__heading">Visit us</p>
          {school.address.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <p>{school.hours}</p>
        </div>
        <div>
          <p className="footer__heading">Get in touch</p>
          <p>
            <a href={`tel:${school.phone.replace(/\s/g, '')}`}>{school.phone}</a>
          </p>
          <p>
            <a href={`mailto:${school.email}`}>{school.email}</a>
          </p>
          {socials.map(([name, url]) => (
            <p key={name}>
              <a href={url} target="_blank" rel="noreferrer">
                {name[0].toUpperCase() + name.slice(1)}
              </a>
            </p>
          ))}
        </div>
        <div>
          <p className="footer__heading">Quick links</p>
          <p><Link to="/about">About us</Link></p>
          <p><Link to="/announcements">Announcements</Link></p>
          <p><Link to="/contact">Contact &amp; enrolment</Link></p>
        </div>
      </div>
      <div className="container footer__bottom">
        <p>© {year} {school.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}
