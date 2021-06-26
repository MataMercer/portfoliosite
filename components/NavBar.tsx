/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactSVG } from 'react-svg';
import { useAuth } from '../auth/auth';
import ThemeToggler from './ThemeToggler';

const AuthenticatedMenu = () => {
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <ul className="navbar-items">
      <li
        className={`navbar-item ${
          router.pathname === '/admindashboard' ? 'navbar-item-active' : ''
        }`}
      >
        <Link href="/admindashboard">
          <a>Dashboard</a>
        </Link>
      </li>
      <li className="navbar-item" onClick={logout}>
        <a>Logout</a>
      </li>
    </ul>
  );
};

const NavBar = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  return (
    <header>
      <Link href="/">
        <div className="navbar-brand">
          <ReactSVG
            className="navbar-brand-image"
            src="/matamercerlogo2020.svg"
            loading={() => <span>Loading</span>}
            wrapper="div"
          />
          <div className="navbar-brand-text">Mercer Denholm</div>
        </div>
      </Link>

      <nav>
        <ul className="navbar-items">
          <li>
            <ThemeToggler />
          </li>
          <li
            className={`navbar-item ${
              router.pathname === '/' ? 'navbar-item-active' : ''
            }`}
          >
            <Link href="/">
              <a>Projects</a>
            </Link>
          </li>
          <li
            className={`navbar-item ${
              router.pathname === '/about' ? 'navbar-item-active' : ''
            }`}
          >
            <Link href="/about">
              <a>About</a>
            </Link>
          </li>
          <li
            className={`navbar-item ${
              router.pathname === '/contact' ? 'navbar-item-active' : ''
            }`}
          >
            <Link href="/contact">
              <a>Contact</a>
            </Link>
          </li>
        </ul>

        {isAuthenticated ? <AuthenticatedMenu /> : null}
      </nav>
    </header>
  );
};

export default NavBar;
