import { Row, ListGroup } from 'reactstrap';
import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import Link from 'next/link';
import { FirebaseError } from 'firebase';
import { IProjectEntry } from '../../ModelTypes/interfaces';
import ProjectEntryListItem from './ProjectEntryListItem';
import {
  getProjectEntries,
  deleteProjectEntry,
} from '../../firebase/repositories/ProjectEntryRepository';
import ErrorAlert from '../ErrorAlert';
import { deleteFile } from '../../firebase/repositories/StorageRepository';

export default function ProjectEntryList() {
  const [errors, setErrors] = useState<FirebaseError[]>([]);
  const [projectEntries, setProjectEntries] = useState<IProjectEntry[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('loading');
  useEffect(() => {
    if (status === 'loading') {
      getProjectEntries()
        .then((res) => {
          setProjectEntries(res);
          setStatus('idle');
        })
        .catch((err) => {
          setErrors([...errors, err]);
          setStatus('error');
        });
    }
  }, [errors, status]);

  const deleteProjectEntryAndCleanUpFiles = (projectEntry: IProjectEntry) => {
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
    deleteProjectEntry(projectEntry.id as string)
      .then(() => {
        setProjectEntries(
          projectEntries.filter(
            (projectEntryElem) => projectEntryElem.id !== projectEntry.id
          )
        );
      })
      .catch((err) => {
        setErrors([...errors, err]);
      });
  };

  return (
    <div>
      <Row>
        <ErrorAlert errors={errors} />
      </Row>
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
