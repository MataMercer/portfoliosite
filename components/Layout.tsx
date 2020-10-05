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
      <title>{`${title} - Mercer Denholm Portfolio`}</title>
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta
        name="description"
        content="A portfolio of software projects by Mercer Lee Denholm. View his work or get in contact with him through email, Github, or LinkedIn."
      />
    </Head>

    <div className="content">
      <div className="article-nav-container">
        <NavBar />

        <main>
          <article>{children}</article>
        </main>
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
