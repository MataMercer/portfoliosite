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
import Link from 'next/link';
import { IProjectEntry } from '../ModelTypes/interfaces';
import CompletionStatusBadge from './CompletionStatusBadge';

const ProjectEntryThumbnail = (props: IProjectEntry) => {
  const {
    id,
    title,
    introDescription,
    demoLink,
    pictureUrls,
    tags,
    completionStatus,
  } = props;

  const ImageShowSecondPictureOnHover = ({ pictureSrc, altText }: any) => {
    return (
      <div>
        <img src={pictureSrc} alt={altText} />
      </div>
    );
  };

  return (
    <Link
      scroll={false}
      href={`/?projectentryid=${id}`}
      as={`/projectentry/${id}`}
    >
      <a className="project-entry-anchor">
        <Container className="project-entry" color="primary" fluid="xs">
          <Row>
            <Col>
              <img
                className={`project-entry-thumbnail-image ${
                  pictureUrls.length > 1
                    ? 'project-entry-thumbnail-image-first'
                    : ''
                }`}
                src={pictureUrls.length > 0 ? pictureUrls[0] : '/no-image.png'}
                alt="ProjectEntryThumbnail"
              />
              {pictureUrls.length > 1 ? (
                <img
                  className="project-entry-thumbnail-image-second"
                  src={
                    pictureUrls.length > 1 ? pictureUrls[1] : '/no-image.png'
                  }
                  alt="ProjectEntryThumbnail"
                />
              ) : null}
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
      </a>
    </Link>
  );
};

export default ProjectEntryThumbnail;
