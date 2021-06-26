/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col,
  Badge,
} from 'reactstrap';
import ReactMarkdown from 'react-markdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import Skeleton from 'react-loading-skeleton';
import { IProjectEntry } from '../ModelTypes/interfaces';
import ThumbnailCarousel from './ThumbnailCarousel';
import CompletionStatusBadge from './CompletionStatusBadge';
import ErrorAlert from './ErrorAlert';
import useProjectEntry from '../firebase/hooks/useProjectEntry';

type ProjectEntryProps = {
  projectEntryId?: string;
  projectEntryLocal?: IProjectEntry;
  setPageTitle?: (pageTitle: string) => void;
};

const ProjectEntry = ({
  projectEntryId,
  projectEntryLocal,
  setPageTitle,
}: ProjectEntryProps) => {
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
  }, [projectEntryId, fetchedProjectEntry]);

  const Carousel = () => (
    <ThumbnailCarousel
      pictureUrls={
        projectEntryState?.pictureUrls &&
        projectEntryState.pictureUrls.length > 0
          ? projectEntryState.pictureUrls
          : ['/no-image.png']
      }
    />
  );

  const LoadingPlaceholder = () => (
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

  const Text = () => {
    if (status === 'loading' && !projectEntryLocal) {
      return <LoadingPlaceholder />;
    }
    if (projectEntryState) {
      const {
        completionStatus,
        title,
        repoLink,
        demoLink,
        tags,
        description,
        updatedAt,
      } = projectEntryState;
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
              <CompletionStatusBadge completionStatus={completionStatus} />
              {Object.keys(tags).map((tag) => (
                <Badge key={tag} color="info">
                  {tag}
                </Badge>
              ))}
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
    return <></>;
  };

  return projectEntryId ? (
    <Row>
      <Col lg="8" className="project-entry-thumbnail-carousel-panel-no-modal">
        <Container>
          <Carousel />
        </Container>
      </Col>
      <Col lg="4" className="project-entry-thumbnail-text-panel-no-modal">
        <ModalHeader
          toggle={() => {
            router.push('/');
          }}
        />
        <Container>
          <Text />
        </Container>
      </Col>
    </Row>
  ) : (
    <Modal
      contentClassName="project-entry-modal"
      centered
      size="xl"
      toggle={() => router.push('/')}
      isOpen={router.query.projectentryid === projectEntryLocal?.id}
    >
      <Row>
        <Col lg="8" className="project-entry-thumbnail-carousel-panel-modal">
          <Carousel />
        </Col>
        <Col lg="4" className="project-entry-thumbnail-text-panel-modal">
          <ModalBody>
            <ModalHeader
              toggle={() => {
                router.push('/');
              }}
            />
            <Text />
          </ModalBody>
        </Col>
      </Row>
    </Modal>
  );
};

export default ProjectEntry;
