import React from 'react';
import ProtectRoute from '../auth/ProtectRoute';
import Layout from '../components/Layout';
import AboutForm from '../components/forms/AboutForm';

function AboutFormPage() {
  return (
    <div>
      <Layout title="Manage About Page">
        <h1>About Page Form</h1>
        <AboutForm />
      </Layout>
    </div>
  );
}

export default ProtectRoute(AboutFormPage);
