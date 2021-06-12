import React from 'react';
import ProtectRoute from '../auth/ProtectRoute';
import Layout from '../components/Layout';
import ProjectEntryForm from '../components/forms/ProjectEntryForm';

function ProjectEntryFormPage() {
  return (
    <div>
      <Layout title="Project Entry Form">
        <h1>New Project Entry</h1>
        <ProjectEntryForm projectEntryId="" />
      </Layout>
    </div>
  );
}

export default ProtectRoute(ProjectEntryFormPage);
