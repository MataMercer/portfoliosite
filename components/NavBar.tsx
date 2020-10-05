/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../auth/auth';

const NavBar = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  return (
    <header>
      <Link href="/">
        <div className="navbar-brand">
          <img
            className="navbar-brand-image"
            src="/matamercerlogo2020.svg"
            alt="Mercer Denholm Logo"
          />
          <span className="navbar-brand-text">Mercer Denholm</span>
        </div>
      </Link>
      <nav>
        <ul className="navbar-items">
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
        Logout
      </li>
    </ul>
  );
};

export default NavBar;
