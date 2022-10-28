import { Col, Container, Row } from 'react-bootstrap';
import { IProjectEntry } from '../ModelTypes/interfaces';
import ProjectEntry from './ProjectEntry';
import ErrorAlert from './ErrorAlert';
import ProjectEntryThumbnail from './ProjectEntryThumbnail';
import useProjectEntry from '../firebase/hooks/useProjectEntry';
import CenterSpinner from './CenterSpinner';

export default function ProjectEntryList() {
  const { projectEntries, status, errors } = useProjectEntry({
    initialLoad: true,
  });
  const projectEntriesPerRow = 3;

  return (
    <Container>
      <Row>
        <ErrorAlert {...{ errors }} />
      </Row>
      <CenterSpinner {...{ status }} />

      {projectEntries.map((projectEntryRow, index) => {
        if (index % projectEntriesPerRow === 0) {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <Row key={index}>
              {projectEntries
                .slice(index, index + projectEntriesPerRow)
                .map((projectEntry: IProjectEntry) => (
                  <Col md="4" key={projectEntry.id}>
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
                      updatedAt={projectEntry.updatedAt}
                    />
                    <ProjectEntry projectEntryLocal={projectEntry} />
                  </Col>
                ))}
            </Row>
          );
        }
        return null;
      })}
    </Container>
  );
}
