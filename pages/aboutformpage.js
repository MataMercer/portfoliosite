import { ProtectRoute } from '../auth/ProtectRoute'
import Link from "next/link";
import Layout from "../components/Layout";
import AboutForm from "../components/forms/AboutForm";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";

function AboutFormPage() {
  return (
    <div>
      <Layout title="Manage About Page">
        <AboutForm/>      
      </Layout>
    </div>
  );
};

export default ProtectRoute(AboutFormPage)
