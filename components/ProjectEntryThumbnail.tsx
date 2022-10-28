/* eslint-disable no-unused-vars */
import Link from 'next/link';
import Image from 'next/image';
import { Badge, Col, Container, Row } from 'react-bootstrap';
import { IProjectEntry } from '../ModelTypes/interfaces';
import CompletionStatusBadge from './CompletionStatusBadge';

function ProjectEntryThumbnail(props: IProjectEntry) {
  const {
    id,
    title,
    introDescription,
    demoLink,
    pictureUrls,
    tags,
    completionStatus,
  } = props;

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
              <div className="project-entry-thumbnail-image-wrapper">
                <Image
                  className={`project-entry-thumbnail-image ${
                    pictureUrls.length > 1
                      ? 'project-entry-thumbnail-image-first'
                      : ''
                  }`}
                  src={
                    pictureUrls.length > 0 ? pictureUrls[0] : '/no-image.png'
                  }
                  layout="fill"
                  alt="ProjectEntryThumbnail"
                />
                {pictureUrls.length > 1 && (
                  <Image
                    className="project-entry-thumbnail-image-second"
                    src={
                      pictureUrls.length > 1 ? pictureUrls[1] : '/no-image.png'
                    }
                    alt="ProjectEntryThumbnail"
                    layout="fill"
                  />
                )}
              </div>
            </Col>
          </Row>
          <div className="project-entry-text">
            <Row>
              <Col>
                <h2>
                  <strong>{title}</strong>
                </h2>
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
                    <Badge key={tag} bg="info">
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
}

export default ProjectEntryThumbnail;
