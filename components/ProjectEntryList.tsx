import { Row, Col } from 'reactstrap';
import { FirebaseError } from 'firebase';
import { useState, useEffect, useCallback } from 'react';
// eslint-disable-next-line no-unused-vars
import { useFirebase } from '../firebase/FirebaseContext';
import { IProjectEntry } from '../types/interfaces';
import ProjectEntry from './ProjectEntry';

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
          tempProjectEntries = [
            ...tempProjectEntries,
            doc.data() as IProjectEntry,
          ];
        });

        setProjectEntries(tempProjectEntries);
        setLoading(false);
      });
  }, [database]);

  useEffect(() => {
    getProjectEntries();
  }, [getProjectEntries]);

  return (
    <div>
      {projectEntries.map((projectEntryRow, index) => {
        if (index % projectEntriesPerRow === 0) {
          return (
            <Row>
              {projectEntries
                .slice(index, index + projectEntriesPerRow)
                .map((projectEntry: IProjectEntry) => (
                  <Col sm="6">
                    <ProjectEntry
                      title={projectEntry.title}
                      introDescription={projectEntry.introDescription}
                      description={projectEntry.description}
                      repoLink={projectEntry.repoLink}
                      demoLink={projectEntry.demoLink}
                      pictureUrls={projectEntry.pictureUrls}
                    />
                  </Col>
                ))}
            </Row>
          );
        }
        return null;
      })}
    </div>
  );
}
