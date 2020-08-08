import Head from "next/head";
import NavBar from "./NavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";


const Layout = (props) => (
  <div className="layout">
    <Head>
      <title>{props.title ? props.title : ""}</title>
    </Head>

    <div className="content">
      <NavBar />

        <article>{props.children}</article>


      <footer>
        <hr />
        <ul>
          <li>
            <a href="https://github.com/MataMercer">
              {" "}
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
