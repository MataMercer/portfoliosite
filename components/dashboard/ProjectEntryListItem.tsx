import React, { useState } from 'react';
import { ListGroupItem, Row, Col, Button } from 'reactstrap';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { IProjectEntry } from '../../types/interfaces';
import { useFirebase } from '../../firebase/FirebaseContext';
import ProjectEntry from '../ProjectEntry';

type ProjectEntryListItemProps = {
  projectEntry: IProjectEntry;
  deleteProjectEntry: (id: string) => void;
};

const ProjectEntryListItem = ({
  projectEntry,
  deleteProjectEntry,
}: ProjectEntryListItemProps) => {
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const { database } = useFirebase();

  const handleTrashcanButtonClick = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    setShowDeleteWarning(true);
  };

  const handleCancelButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setShowDeleteWarning(false);
  };

  const handleDeleteButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    deleteProjectEntry(projectEntry.id);
  };

  return (
    <ListGroupItem>
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
