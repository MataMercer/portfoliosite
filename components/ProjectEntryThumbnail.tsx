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

  const [showSecondPicture, setShowSecondPicture] = useState(false);

  const ImageShowSecondPictureOnHover = ({
    pictureSrc,
    picture2Src,
    altText,
  }: any) => {
    return (
      <div>
        <img
          className={`project-entry-thumbnail-image ${
            picture2Src ? 'project-entry-thumbnail-image-first' : ''
          }`}
          src={pictureSrc}
          alt={altText}
          hidden={showSecondPicture && picture2Src}
        />

        <img
          className="project-entry-thumbnail-image project-entry-thumbnail-image-second"
          alt={`${altText}2`}
          src={picture2Src}
          hidden={!(showSecondPicture && picture2Src)}
        />
      </div>
    );
  };

  return (
    <Link
      scroll={false}
      href={`/?projectentryid=${id}`}
      as={`/projectentry/${id}`}
    >
      <a
        onMouseOver={() => {
          setTimeout(() => {
            setShowSecondPicture(true);
          }, 140);
        }}
        onFocus={() => {
          setShowSecondPicture(true);
        }}
        onBlur={() => {
          setShowSecondPicture(false);
        }}
        onMouseLeave={() => {
          setTimeout(() => {
            setShowSecondPicture(false);
          }, 140);
        }}
        className="project-entry-anchor"
      >
        <Container className="project-entry" color="primary" fluid="xs">
          <Row>
            <Col>
              <ImageShowSecondPictureOnHover
                pictureSrc={
                  pictureUrls.length > 0 ? pictureUrls[0] : '/no-image.png'
                }
                picture2Src={pictureUrls.length > 1 ? pictureUrls[1] : ''}
                altText="ProjectEntryThumbnail"
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
      </a>
    </Link>
  );
};

export default ProjectEntryThumbnail;
