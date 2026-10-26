import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand" aria-label="InternSphere Home">
          <span className="brand-badge">IS</span>
          <span className="brand-text">
            Intern<span className="brand-highlight">Sphere</span>
          </span>
        </Link>

        <nav className="nav-links" aria-label="Main Navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? 'nav-item nav-item-active' : 'nav-item'
            }
          >
            Internships
          </NavLink>
          <NavLink
            to="/applications"
            className={({ isActive }) =>
              isActive ? 'nav-item nav-item-active' : 'nav-item'
            }
          >
            Applications
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
