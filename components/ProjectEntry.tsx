/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import Skeleton from 'react-loading-skeleton';
import { FirebaseError } from 'firebase/app';
import { Row, Col, Badge, Container, Modal } from 'react-bootstrap';
import { IProjectEntry } from '../ModelTypes/interfaces';
import ThumbnailCarousel from './ThumbnailCarousel';
import CompletionStatusBadge from './CompletionStatusBadge';
import ErrorAlert from './ErrorAlert';
import useProjectEntry from '../firebase/hooks/useProjectEntry';
import { RequestStatus } from '../ModelTypes/RequestStatus';

function LoadingPlaceholder() {
  return (
    <>
      <Skeleton height={50} />
      <Skeleton count={2} />
      <Row>
        <Col>
          <Skeleton />
        </Col>
        <Col>
          <Skeleton />
        </Col>
        <Col>
          <Skeleton />
        </Col>
        <Col>
          <Skeleton />
        </Col>
      </Row>
      <Skeleton count={15} />
    </>
  );
}

type TextProps = {
  status: RequestStatus;
  projectEntry?: IProjectEntry;
  errors: FirebaseError[];
};
function Text({ status, projectEntry, errors }: TextProps) {
  if (status === 'loading' && !projectEntry) {
    return <LoadingPlaceholder />;
  }
  if (projectEntry) {
    const {
      completionStatus,
      title,
      repoLink,
      demoLink,
      tags,
      description,
      updatedAt,
    } = projectEntry;
    return (
      <>
        <Row>
          <ErrorAlert errors={errors} />
        </Row>
        <Row>
          <h2>{title}</h2>
        </Row>
        {repoLink ? (
          <Row>
            <a target="_blank" rel="noreferrer" href={repoLink}>
              <FontAwesomeIcon icon={faGithub} /> Repository
            </a>
          </Row>
        ) : (
          <Row>
            <div>No repository available</div>
          </Row>
        )}
        {demoLink ? (
          <Row>
            <a target="_blank" rel="noreferrer" href={demoLink}>
              <FontAwesomeIcon icon={faExternalLinkAlt} /> Demo
            </a>
          </Row>
        ) : (
          <Row>
            <div>No demo available</div>
          </Row>
        )}
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
        <Row>
          <ReactMarkdown className="project-entry-description">
            {description}
          </ReactMarkdown>
        </Row>
        <Row>
          <i>
            {updatedAt
              ? `Last updated on ${updatedAt.toDate().toDateString()}`
              : ''}
          </i>
        </Row>
      </>
    );
  }
  return null;
}
Text.defaultProps = {
  projectEntry: undefined,
};

type ProjectEntryProps = {
  projectEntryId?: string;
  projectEntryLocal?: IProjectEntry;
  setPageTitle?: (pageTitle: string) => void;
};

function ProjectEntry({
  projectEntryId,
  projectEntryLocal,
  setPageTitle,
}: ProjectEntryProps) {
  const [projectEntryState, setProjectEntryState] = useState<IProjectEntry>();
  const {
    projectEntry: fetchedProjectEntry,
    status,
    errors,
  } = useProjectEntry({ initialLoad: !!projectEntryId, projectEntryId });
  const router = useRouter();

  useEffect(() => {
    setProjectEntryState(
      projectEntryId ? fetchedProjectEntry : projectEntryLocal
    );
    if (setPageTitle && projectEntryState) {
      setPageTitle(projectEntryState.title);
    }
  }, [
    projectEntryId,
    fetchedProjectEntry,
    projectEntryLocal,
    setPageTitle,
    projectEntryState,
  ]);

  const pictureUrls =
    projectEntryState && projectEntryState.pictureUrls.length > 0
      ? projectEntryState.pictureUrls
      : ['/no-image.png'];

  return projectEntryId ? (
    <Row>
      <Col lg="8" className="project-entry-thumbnail-carousel-panel-no-modal">
        <Container>
          <ThumbnailCarousel pictureUrls={pictureUrls} />
        </Container>
      </Col>
      <Col lg="4" className="project-entry-thumbnail-text-panel-no-modal">
        <Modal.Header
          closeButton
          onHide={() => {
            router.push('/');
          }}
        />
        <Container>
          <Text
            projectEntry={projectEntryState}
            errors={errors}
            status={status}
          />
        </Container>
      </Col>
    </Row>
  ) : (
    <Modal
      contentClassName="project-entry-modal"
      centered
      size="xl"
      onHide={() => router.push('/')}
      show={router.query.projectentryid === projectEntryLocal?.id}
    >
      <Row>
        <Col lg="8" className="project-entry-thumbnail-carousel-panel-modal">
          <ThumbnailCarousel pictureUrls={pictureUrls} />
        </Col>
        <Col lg="4" className="project-entry-thumbnail-text-panel-modal">
          <Modal.Body>
            <Modal.Header
              closeButton
              onHide={() => {
                router.push('/');
              }}
            />
            <Text
              projectEntry={projectEntryLocal}
              errors={errors}
              status={status}
            />
          </Modal.Body>
        </Col>
      </Row>
    </Modal>
  );
}
ProjectEntry.defaultProps = {
  projectEntryId: undefined,
  projectEntryLocal: undefined,
  setPageTitle: undefined,
};

export default ProjectEntry;
