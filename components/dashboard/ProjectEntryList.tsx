import { Row, Col, ListGroup, ListGroupItem } from 'reactstrap';
import { useState, useEffect, useCallback } from 'react';
// eslint-disable-next-line no-unused-vars
import Link from 'next/link';
import firebase, { FirebaseError } from 'firebase';
import { IProjectEntry } from '../../ModelTypes/interfaces';
import ProjectEntryListItem from './ProjectEntryListItem';
import { getProjectEntries } from '../../firebase/repositories/ProjectEntryRepository';

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

  return (
    <div>
      <ListGroup>
        {projectEntries.map((projectEntry) => (
          <ProjectEntryListItem projectEntry={projectEntry} />
        ))}
      </ListGroup>
    </div>
  );
}
