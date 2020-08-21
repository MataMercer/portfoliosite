import Head from 'next/head';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import NavBar from './NavBar';

type LayoutProps = {
  title: string;
  children: React.ReactNode;
};

const Layout = ({ children, title }: LayoutProps) => (
  <div className="layout">
    <Head>
      <title>{title}</title>
    </Head>

    <div className="content">
      <div className="article-nav-container">
        <NavBar />

        <article>{children}</article>
      </div>
      <footer>
        <ul>
          <li>
            <a href="https://github.com/MataMercer">
              <FontAwesomeIcon icon={faGithub} /> Github
            </a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/mercer-denholm/">
              <FontAwesomeIcon icon={faLinkedin} /> LinkedIn
            </a>
          </li>
        </ul>
        <p>© {new Date().getFullYear()} Mercer Denholm</p>
      </footer>
    </div>
  </div>
);

export default Layout;
