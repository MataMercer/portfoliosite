import Head from "next/head";
import NavBar from "./NavBar";
import React, { useState } from "react";
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

const ProjectEntry = (props) => {
  const { buttonLabel, className, title } = props;

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  return (
    <div>
      <Container className="project-entry" color="primary" onClick={toggle} fluid="xs">
        <Row>
          <Col sm="1">
            <img
              className="project-entry-logo"
              src="/urlshortstatlogo.png"
              alt="my image"
            />
          </Col>
          <Col sm="auto">{title}</Col>
        </Row>
        <Row>
        <Col>
          <img
            className="project-entry-screenshot"
            src="/urlshortstatscreenshot1.png"
            alt="my image"
          />
          </Col>
        </Row>
      </Container>
      <Modal isOpen={modal} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>{title}</ModalHeader>
        <ModalBody>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggle}>
            Do Something
          </Button>{" "}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ProjectEntry;
