/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import {
  Container,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
} from 'reactstrap';
import { IProjectEntry } from '../types/interfaces';

const ProjectEntry = (props: IProjectEntry) => {
  const {
    title,
    introDescription,
    description,
    repoLink,
    demoLink,
    pictureUrls,
  } = props;

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  return (
    <div>
      <Container
        className="project-entry"
        color="primary"
        onClick={toggle}
        fluid="xs"
      >
        <Row>
          <Col>
            {pictureUrls?.length > 0 ? (
              <img
                className="project-entry-screenshot"
                src={pictureUrls[0]}
                alt="project entry screenshot thumbnail"
              />
            ) : null}
          </Col>
        </Row>
        <Row>
          <Col sm="auto">
            <h4>
              <strong>{title}</strong>
            </h4>
          </Col>
        </Row>

        <Row>
          <Col sm="auto">{introDescription}</Col>
        </Row>
      </Container>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>{title}</ModalHeader>
        <ModalBody>{description}</ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggle}>
            Do Something
          </Button>{' '}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ProjectEntry;
