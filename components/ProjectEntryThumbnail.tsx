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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { IProjectEntry } from '../ModelTypes/interfaces';
import CompletionStatusBadge from './CompletionStatusBadge';

const ProjectEntryThumbnail = (props: IProjectEntry) => {
  const {
    title,
    introDescription,
    demoLink,
    pictureUrls,
    tags,
    completionStatus,
  } = props;
  document?.querySelector('a')?.addEventListener('click', function (e) {
    e.stopPropagation();
  });
  return (
    <Container className="project-entry" color="primary" fluid="xs">
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
          <Col>
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
              <CompletionStatusBadge completionStatus={completionStatus} />
              {Object.keys(tags).map((tag) => (
                <Badge key={tag} color="info">
                  {tag}
                </Badge>
              ))}
            </Col>
          </Row>
        ) : null}
      </div>
    </Container>
  );
};

export default ProjectEntryThumbnail;
