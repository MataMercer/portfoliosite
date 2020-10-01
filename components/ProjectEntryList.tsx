import { Row, Col, Modal } from 'reactstrap';
import { FirebaseError } from 'firebase';
import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import Link from 'next/link';
import { useRouter } from 'next/router';
import { IProjectEntry } from '../ModelTypes/interfaces';
import ProjectEntry from './ProjectEntry';
import { getProjectEntries } from '../firebase/repositories/ProjectEntryRepository';
import ErrorAlert from './ErrorAlert';
import ProjectEntryThumbnail from './ProjectEntryThumbnail';

export default function ProjectEntryList() {
  const [errors, setErrors] = useState<FirebaseError[]>([]);
  const [projectEntries, setProjectEntries] = useState<IProjectEntry[]>([]);
  const projectEntriesPerRow = 3;
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('loading');

  const router = useRouter();
  useEffect(() => {
    if (status === 'loading') {
      getProjectEntries()
        .then((res) => {
          setProjectEntries(res);
          setStatus('idle');
        })
        .catch((err) => {
          setStatus('error');
          setErrors([...errors, err]);
        });
    }
  }, [errors, status]);

  return (
    <div>
      <Row>
        <ErrorAlert errors={errors} />
      </Row>

      {projectEntries.map((projectEntryRow, index) => {
        if (index % projectEntriesPerRow === 0) {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <Row key={index}>
              {projectEntries
                .slice(index, index + projectEntriesPerRow)
                .map((projectEntry: IProjectEntry) => (
                  <Col sm="4" key={projectEntry.id}>
                    <ProjectEntryThumbnail
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
                      onClick={() => {
                        router.push(
                          `/?projectentryid=${projectEntry.id}`,
                          `/projectentry/${projectEntry.id}`
                        );
                      }}
                    />
                    <ProjectEntry projectEntry={projectEntry} />
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
