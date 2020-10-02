import React, { useState } from 'react';
import { ListGroupItem, Row, Col, Button } from 'reactstrap';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FirebaseError } from 'firebase';
import { IProjectEntry } from '../../ModelTypes/interfaces';
import { deleteFile } from '../../firebase/repositories/StorageRepository';
import ErrorAlert from '../ErrorAlert';

type ProjectEntryListItemProps = {
  projectEntry: IProjectEntry;
  deleteProjectEntryAndCleanUpFiles: (projectEntry: IProjectEntry) => void;
};

const ProjectEntryListItem = ({
  projectEntry,
  deleteProjectEntryAndCleanUpFiles,
}: ProjectEntryListItemProps) => {
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

  const handleTrashcanButtonClick = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    setShowDeleteWarning(true);
  };

  const handleCancelButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setShowDeleteWarning(false);
  };

  const handleDeleteButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setShowDeleteWarning(false);
    deleteProjectEntryAndCleanUpFiles(projectEntry);
  };

  return (
    <ListGroupItem>
      <Row>
        <Col sm="9">
          <Row>
            <strong>{projectEntry.title}</strong>
          </Row>

          <Row>{projectEntry.introDescription}</Row>
          <Row>
            <i>{`Last updated on ${projectEntry.updatedAt
              .toDate()
              .toDateString()}`}</i>
          </Row>
        </Col>
        {showDeleteWarning ? (
          <Col>
            <Row>
              <Col>
                <Button
                  color="danger"
                  size="sm"
                  onClick={handleDeleteButtonClick}
                >
                  Delete
                </Button>
              </Col>
              <Col>
                <Button size="sm" onClick={handleCancelButtonClick}>
                  Cancel
                </Button>
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
              <Button type="button" onClick={handleTrashcanButtonClick}>
                <FontAwesomeIcon icon={faTrashAlt} />
              </Button>
            </Col>
          </>
        )}
      </Row>
    </ListGroupItem>
  );
};

export default ProjectEntryListItem;
