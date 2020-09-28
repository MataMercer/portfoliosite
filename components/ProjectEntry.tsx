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
  Badge,
} from 'reactstrap';
import ReactMarkdown from 'react-markdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { IProjectEntry } from '../ModelTypes/interfaces';
import ThumbnailCarousel from './ThumbnailCarousel';

const ProjectEntry = (props: IProjectEntry) => {
  const {
    title,
    introDescription,
    description,
    repoLink,
    demoLink,
    pictureUrls,
    tags,
    completionStatus,
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
            <img
              className="project-entry-screenshot"
              src={pictureUrls.length > 0 ? pictureUrls[0] : '/no-image.png'}
              alt="project entry screenshot thumbnail"
            />
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
          {tags ? (
            <Row>
              <Col>
                {Object.keys(tags).map((tag) => (
                  <Badge color="info">{tag}</Badge>
                ))}
              </Col>
            </Row>
          ) : null}
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
          <Col lg="8" className="project-entry-thumbnail-carousel-panel">
            <ThumbnailCarousel
              pictureUrls={
                pictureUrls.length > 0 ? pictureUrls : ['/no-image.png']
              }
            />
          </Col>
          <Col lg="4" className="project-entry-thumbnail-text-panel">
            <ModalBody>
              <ModalHeader toggle={toggle} />

              <h2>{title}</h2>
              {repoLink ? (
                <Row>
                  <a href={repoLink}>
                    <FontAwesomeIcon icon={faGithub} /> Repository
                  </a>
                </Row>
              ) : (
                <div>No repository available</div>
              )}
              {demoLink ? (
                <Row>
                  <a href={demoLink}>
                    <FontAwesomeIcon icon={faExternalLinkAlt} /> Demo
                  </a>
                </Row>
              ) : (
                <div>No demo available</div>
              )}
              {tags ? (
                <Row>
                  {Object.keys(tags).map((tag) => (
                    <Badge color="info">{tag}</Badge>
                  ))}
                </Row>
              ) : null}
              <ReactMarkdown source={description} />
            </ModalBody>
          </Col>
        </Row>
      </Modal>
    </div>
  );
};

export default ProjectEntry;
