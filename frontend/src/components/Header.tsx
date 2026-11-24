import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { school } from '../content/school';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/announcements', label: 'Announcements' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand__mark" aria-hidden="true">VC</span>
          <span className="brand__name">{school.name}</span>
        </Link>

        <button
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="sr-only">Menu</span>
          <span className="nav-toggle__bar" />
          <span className="nav-toggle__bar" />
          <span className="nav-toggle__bar" />
        </button>

        <nav id="main-nav" className={`nav ${open ? 'nav--open' : ''}`} aria-label="Main">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) => `nav__link ${isActive ? 'nav__link--active' : ''}`}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
          <Link to="/contact" className="btn btn--sun nav__cta" onClick={() => setOpen(false)}>
            Enrol now
          </Link>
        </nav>
      </div>
    </header>
  );
}
