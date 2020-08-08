import Link from "next/link";
import { Col, Row, Container } from "reactstrap";
import {useAuth} from '../auth/auth';
const NavBar = () => {

  const { isAuthenticated } = useAuth()

  return(
  <header>
    <Link href="/">
      <div className="navbar-brand">
        <img
          className="navbar-brand-image"
          src="/matamercerlogo2020.svg"
          alt="my image"
        />
        <span className="navbar-brand-text">Mercer Denholm</span>
      </div>
    </Link>
    <nav>
      <ul className="navbar-items">
        <li className="navbar-item">
          <Link href="/about">
            <a>ABOUT</a>
          </Link>
        </li>
        <li className="navbar-item">
          <Link href="/contact">
            <a>CONTACT</a>
          </Link>
        </li>
      </ul>

      {isAuthenticated? <AuthenticatedMenu/>: null}
      
    </nav>
  </header>);
};

const AuthenticatedMenu = () => {
  const {logout } = useAuth();

  return (
    <ul className="navbar-items">
        <li className="navbar-item">
          <Link href="/admindashboard">
            <a>DASHBOARD</a>
          </Link>
        </li>
        <li className="navbar-item" onClick={logout}>
          LOGOUT
        </li>
      </ul>
  );
}

export default NavBar;
