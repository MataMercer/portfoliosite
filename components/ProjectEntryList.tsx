import { Row, Col } from 'reactstrap';
import { FirebaseError } from 'firebase';
import { useState, useEffect, useCallback } from 'react';
// eslint-disable-next-line no-unused-vars
import { IProjectEntry } from '../ModelTypes/interfaces';
import ProjectEntry from './ProjectEntry';
import { getProjectEntries } from '../firebase/repositories/ProjectEntryRepository';

export default function ProjectEntryList() {
  const [errors, setErrors] = useState<FirebaseError>();
  const [projectEntries, setProjectEntries] = useState<IProjectEntry[]>([]);
  const projectEntriesPerRow = 3;
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getProjectEntries().then((res) => {
      setProjectEntries(res);
    });
  }, []);

  return (
    <div>
      {projectEntries.map((projectEntryRow, index) => {
        if (index % projectEntriesPerRow === 0) {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <Row key={index}>
              {projectEntries
                .slice(index, index + projectEntriesPerRow)
                .map((projectEntry: IProjectEntry) => (
                  <Col sm="4" key={projectEntry.id}>
                    <ProjectEntry
                      key={projectEntry.id}
                      id={projectEntry.id}
                      title={projectEntry.title}
                      introDescription={projectEntry.introDescription}
                      description={projectEntry.description}
                      repoLink={projectEntry.repoLink}
                      demoLink={projectEntry.demoLink}
                      completionStatus={projectEntry.completionStatus}
                      tags={projectEntry.tags}
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
