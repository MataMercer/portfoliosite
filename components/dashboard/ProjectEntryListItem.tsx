import React, { useState } from 'react';
import { ListGroupItem, Row, Col, Button } from 'reactstrap';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FirebaseError } from 'firebase';
import { IProjectEntry } from '../../ModelTypes/interfaces';
import { deleteProjectEntry } from '../../firebase/repositories/ProjectEntryRepository';
import { deleteFile } from '../../firebase/repositories/StorageRepository';
import ErrorAlert from '../ErrorAlert';

type ProjectEntryListItemProps = {
  projectEntry: IProjectEntry;
};

const ProjectEntryListItem = ({ projectEntry }: ProjectEntryListItemProps) => {
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [errors, setErrors] = useState<FirebaseError[]>([]);

  const handleTrashcanButtonClick = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    setShowDeleteWarning(true);
  };

  const handleCancelButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setShowDeleteWarning(false);
  };

  const handleDeleteButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (projectEntry?.id) {
      setShowDeleteWarning(false);
      let errored = false;
      try {
        projectEntry.pictureUrls.map((url) => deleteFile(url));
      } catch (err) {
        errored = true;
        setErrors([...errors, err]);
      }
      if (errored) {
        return;
      }
      deleteProjectEntry(projectEntry.id).catch((err) => {
        setErrors([...errors, err]);
      });
    }
  };

  return (
    <ListGroupItem>
      <Row>
        <ErrorAlert errors={errors} />
      </Row>
      <Row>
        <Col sm="10">
          <Row>
            <strong>{projectEntry.title}</strong>
          </Row>
          <Row>{projectEntry.introDescription}</Row>
        </Col>
        {showDeleteWarning ? (
          <Col>
            <Row>
              <Col>
                <Button color="danger" onClick={handleDeleteButtonClick}>
                  Delete
                </Button>
              </Col>
              <Col>
                <Button onClick={handleCancelButtonClick}>Cancel</Button>
              </Col>
            </Row>
          </Col>
        ) : (
          <>
            <Col>
              <Link href={`projectentryform/${projectEntry.id}`}>
                <a>
                  <FontAwesomeIcon icon={faEdit} />
                </a>
              </Link>
            </Col>
            <Col>
              <button type="button" onClick={handleTrashcanButtonClick}>
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>
            </Col>
          </>
        )}
      </Row>
    </ListGroupItem>
  );
};

export default ProjectEntryListItem;
