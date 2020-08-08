import { ProtectRoute } from '../auth/ProtectRoute'
import Layout from "../components/Layout";
import ProjectEntryForm from "../components/forms/ProjectEntryForm";


function ProjectEntryFormPage() {
  return (
    <div>
      <Layout title="Manage About Page">
        <h1>New Project Entry</h1>
        <ProjectEntryForm/>      
      </Layout>
    </div>
  );
};

export default ProtectRoute(ProjectEntryFormPage)
