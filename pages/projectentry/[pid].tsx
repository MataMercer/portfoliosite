import { useRouter } from 'next/router';
import { useState } from 'react';
import Layout from '../../components/Layout';
import ProjectEntry from '../../components/ProjectEntry';

const ProjectEntryPage = () => {
  const router = useRouter();
  const { pid } = router.query;

  const [title, setTitle] = useState<string>('Project Entry');
  return (
    <Layout title={title}>
      <ProjectEntry projectEntryId={pid as string} setPageTitle={setTitle} />
    </Layout>
  );
};

export default ProjectEntryPage;
