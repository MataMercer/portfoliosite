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
import ReactMarkdown from 'react-markdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { IProjectEntry } from '../types/interfaces';
import ThumbnailCarousel from './ThumbnailCarousel';

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
        <div className="project-entry-text">
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
        </div>
      </Container>
      <Modal
        isOpen={modal}
        toggle={toggle}
        contentClassName="project-entry-modal"
        centered
        size="xl"
      >
        
        <Row>
          <Col sm="8" className="project-entry-thumbnail-carousel-panel">
            <ThumbnailCarousel pictureUrls={pictureUrls} />
          </Col>
          <Col sm="4" className="project-entry-thumbnail-text-panel">
          <ModalBody>
            <ModalHeader toggle={toggle}></ModalHeader>
            
              <h2>{title}</h2>
              <ul>
                <li>
                  <a href={repoLink}>
                    <FontAwesomeIcon icon={faGithub} /> Repository
                  </a>
                </li>
                <li>
                  <a href={repoLink}>
                    <FontAwesomeIcon icon={faExternalLinkAlt} /> Demo
                  </a>
                </li>
              </ul>
              <ReactMarkdown source={description} />
              </ModalBody>
          </Col>
        </Row>
        
      </Modal>
    </div>
  );
};

export default ProjectEntry;
