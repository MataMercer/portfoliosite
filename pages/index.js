import Layout from "../components/Layout";
import ProjectEntry from "../components/ProjectEntry";
import {
  Container,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
} from "reactstrap";
export default function Home() {
  return (
    <div>
      <Layout title="Home">
        <section>
          <h1>Project Gallery</h1>
          <p>Works done in my free time.</p>
            <Row>
              <Col sm="6">
                <ProjectEntry title="React Url Shortener and Visit Tracker"/>
              </Col>
              <Col sm="6">
                <ProjectEntry title="React Url Shortener and Visit Tracker"/>
              </Col>

            </Row>
            <Row>
              <Col sm="6">
                <ProjectEntry title="React Url Shortener and Visit Tracker"/>
              </Col>

              
            </Row>
        </section>
      </Layout>
    </div>
  );
}
