import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import ProjectEntry from '../../components/ProjectEntry';

const ProjectEntryPage = () => {
  const router = useRouter();
  const { pid } = router.query;
  return (
    <Layout title="project entry">
      <ProjectEntry projectEntryId={pid as string} />
    </Layout>
  );
};

export default ProjectEntryPage;
