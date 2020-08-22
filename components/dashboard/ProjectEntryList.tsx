import { Row, Col, ListGroup, ListGroupItem } from 'reactstrap';
import { FirebaseError } from 'firebase';
import { useState, useEffect, useCallback } from 'react';
// eslint-disable-next-line no-unused-vars
import Link from 'next/link';
import { useFirebase } from '../../firebase/FirebaseContext';
import { IProjectEntry } from '../../types/interfaces';
import ProjectEntryListItem from './ProjectEntryListItem';

export default function ProjectEntryList() {
  const [errors, setErrors] = useState<FirebaseError>();
  const [projectEntries, setProjectEntries] = useState<IProjectEntry[]>([]);
  const { database } = useFirebase();
  const projectEntriesPerRow = 2;
  const [loading, setLoading] = useState(true);

  const getProjectEntries = useCallback(() => {
    database
      ?.collection('projectentries')
      .get()
      .then((querySnapshot) => {
        let tempProjectEntries: IProjectEntry[] = [];
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          const projectEntry = doc.data() as IProjectEntry;
          projectEntry.id = doc.id;
          tempProjectEntries = [...tempProjectEntries, projectEntry];
        });

        setProjectEntries(tempProjectEntries);
        setLoading(false);
      });
  }, [database]);

  const deleteProjectEntry = (idToDelete: string) => {
    database
      ?.collection('projectentries')
      .doc(idToDelete)
      .delete()
      .then(() => {
        setProjectEntries(projectEntries.filter(({ id }) => id !== idToDelete));
      });
  };

  useEffect(() => {
    getProjectEntries();
  }, [getProjectEntries]);

  return (
    <div>
      <ListGroup>
        {projectEntries.map((projectEntry) => (
          <ProjectEntryListItem
            projectEntry={projectEntry}
            deleteProjectEntry={deleteProjectEntry}
          />
        ))}
      </ListGroup>
    </div>
  );
}
