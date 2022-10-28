import React from 'react';
import { Row, ListGroup } from 'react-bootstrap';
import { IProjectEntry } from '../../ModelTypes/interfaces';
import ProjectEntryListItem from './ProjectEntryListItem';
import ErrorAlert from '../ErrorAlert';
import useProjectEntries from '../../firebase/hooks/useProjectEntry';
import useStorage from '../../firebase/hooks/useStorage';
import CenterSpinner from '../CenterSpinner';

export default function ProjectEntryList() {
  const { projectEntries, deleteProjectEntry, status, errors } =
    useProjectEntries({ initialLoad: true });
  const { deleteFile } = useStorage();
  const deleteProjectEntryAndCleanUpFiles = (projectEntry: IProjectEntry) => {
    Promise.all(projectEntry.pictureUrls.map((url) => deleteFile(url))).then(
      () => {
        deleteProjectEntry(projectEntry.id as string);
      }
    );
  };

  return (
    <div>
      <Row>
        <ErrorAlert errors={errors} />
      </Row>
      <CenterSpinner {...{ status }} />
      <ListGroup>
        {projectEntries.map((projectEntry) => (
          <ProjectEntryListItem
            key={projectEntry.id}
            projectEntry={projectEntry}
            deleteProjectEntryAndCleanUpFiles={
              deleteProjectEntryAndCleanUpFiles
            }
          />
        ))}
      </ListGroup>
    </div>
  );
}
