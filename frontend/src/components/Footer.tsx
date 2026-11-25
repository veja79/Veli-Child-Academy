import { Link } from 'react-router-dom';
import { school, telHref } from '../content/school';

export default function Footer() {
  const year = new Date().getFullYear();
  const socials = Object.entries(school.social).filter(([, url]) => url);

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <img src="/logo.png" alt={school.name} className="footer__logo" width="80" height="82" />
          <p className="footer__brand">{school.tagline}</p>
        </div>
        <div>
          <p className="footer__heading">Visit us</p>
          {school.address.map((line) => (
            <p key={line}>{line}</p>
          ))}
          {school.hours && <p>{school.hours}</p>}
        </div>
        <div>
          <p className="footer__heading">Get in touch</p>
          {school.phones.map((p) => (
            <p key={p}>
              <a href={telHref(p)}>{p}</a>
            </p>
          ))}
          {school.email && (
            <p>
              <a href={`mailto:${school.email}`}>{school.email}</a>
            </p>
          )}
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
          <p><Link to="/announcements">News &amp; events</Link></p>
          <p><Link to="/gallery">Gallery</Link></p>
          <p><Link to="/register">Register your child</Link></p>
          <p><Link to="/contact">Contact us</Link></p>
        </div>
      </div>
      <div className="container footer__bottom">
        <p>© {year} {school.name}. All rights reserved. · <Link to="/privacy">Privacy policy</Link></p>
        <p className="footer__credit">
          <Link to="/admin">Staff login</Link> · Website by <a href="https://github.com/Veja79" target="_blank" rel="noreferrer">Siphesihle Dlomo</a>
        </p>
      </div>
    </footer>
  );
}
