import { useRouter } from 'next/router';
import ProtectRoute from '../../auth/ProtectRoute';
import Layout from '../../components/Layout';
import ProjectEntryForm from '../../components/forms/ProjectEntryForm';

function ProjectEntryFormPage() {
  const router = useRouter();
  const { pid } = router.query;
  return (
    <div>
      <Layout title="Project Entry Form">
        <h1> Project Entry Form</h1>
        <ProjectEntryForm projectEntryId={pid as string} />
      </Layout>
    </div>
  );
}

export default ProtectRoute(ProjectEntryFormPage);
