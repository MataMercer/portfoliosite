/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
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
import { FirebaseError } from 'firebase';
import { useRouter } from 'next/router';
import Skeleton from 'react-loading-skeleton';
import { IProjectEntry } from '../ModelTypes/interfaces';
import ThumbnailCarousel from './ThumbnailCarousel';
import CompletionStatusBadge from './CompletionStatusBadge';
import { getProjectEntry } from '../firebase/repositories/ProjectEntryRepository';
import ErrorAlert from './ErrorAlert';

type ProjectEntryProps = {
  projectEntryId?: string;
  projectEntry?: IProjectEntry;
  setPageTitle?: (pageTitle: string) => void;
};

const ProjectEntry = ({
  projectEntryId,
  projectEntry,
  setPageTitle,
}: ProjectEntryProps) => {
  const [title, setTitle] = useState<string>('');
  const [introDescription, setIntroDescription] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [repoLink, setRepoLink] = useState<string>('');
  const [demoLink, setDemoLink] = useState<string>('');
  const [completionStatus, setCompletionStatus] = useState<
    'inProgress' | 'onHold' | 'completed'
  >('inProgress');
  const [tags, setTags] = useState<{ [name: string]: true }>({});
  const [pictureUrls, setPictureUrls] = useState<string[]>([]);
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'submitting' | 'error'
  >('loading');
  const [updatedAt, setUpdatedAt] = useState<firebase.firestore.Timestamp>();
  const [errors, setErrors] = useState<FirebaseError[]>([]);

  const router = useRouter();
  useEffect(() => {
    if (status === 'loading') {
      if (projectEntryId) {
        getProjectEntry(projectEntryId)
          .then((fetchedProjectEntry) => {
            if (fetchedProjectEntry) {
              setTitle(fetchedProjectEntry.title);
              setIntroDescription(fetchedProjectEntry.introDescription);
              setDescription(fetchedProjectEntry.description);
              setDemoLink(fetchedProjectEntry.demoLink);
              setRepoLink(fetchedProjectEntry.repoLink);
              setPictureUrls(fetchedProjectEntry.pictureUrls);
              setCompletionStatus(fetchedProjectEntry.completionStatus);
              setTags(fetchedProjectEntry.tags);
              setUpdatedAt(fetchedProjectEntry.updatedAt);

              if (setPageTitle) {
                setPageTitle(fetchedProjectEntry.title);
              }

              setStatus('idle');
            }
          })
          .catch((err) => {
            setStatus('error');
            setErrors([...errors, err]);
          });
      } else if (projectEntry) {
        setTitle(projectEntry.title);
        setIntroDescription(projectEntry.introDescription);
        setDescription(projectEntry.description);
        setDemoLink(projectEntry.demoLink);
        setRepoLink(projectEntry.repoLink);
        setPictureUrls(projectEntry.pictureUrls);
        setCompletionStatus(projectEntry.completionStatus);
        setTags(projectEntry.tags);
        setUpdatedAt(projectEntry.updatedAt);

        if (setPageTitle) {
          setPageTitle(projectEntry.title);
        }
        setStatus('idle');
      }
    }
  }, [errors, projectEntry, projectEntryId, setPageTitle, status]);

  const Carousel = () => (
    <ThumbnailCarousel
      pictureUrls={pictureUrls.length > 0 ? pictureUrls : ['/no-image.png']}
    />
  );

  const Text = () =>
    status === 'loading' ? (
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
    ) : (
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
          <ReactMarkdown
            className="project-entry-description"
            source={description}
          />
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
      isOpen={router.query.projectentryid === projectEntry?.id}
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
