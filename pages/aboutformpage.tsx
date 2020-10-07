import ProtectRoute from '../auth/ProtectRoute';
import Layout from '../components/Layout';
import AboutForm from '../components/forms/AboutForm';

const AboutFormPage = () => {
  return (
    <div>
      <Layout title="Manage About Page">
        <h1>About Page Form</h1>
        <AboutForm />
      </Layout>
    </div>
  );
};

export default ProtectRoute(AboutFormPage);
