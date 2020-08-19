import ProtectRoute from '../auth/ProtectRoute';
import Layout from '../components/Layout';
import AboutForm from '../components/forms/AboutForm';

const AboutFormPage = () => {
  return (
    <div>
      <Layout title="Manage About Page">
        <AboutForm />
      </Layout>
    </div>
  );
};

export default ProtectRoute(AboutFormPage);
