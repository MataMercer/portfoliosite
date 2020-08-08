import Layout from "../components/Layout";
import React from "react";
import LoginForm from "../components/forms/LoginForm";

export default function AuthenticateAdmin() {
  return (
    <div>
      <Layout title="Authenticate Admin">
        <h1 className="title">Admin Login</h1>
        <p>Unless you are Mercer Denholm, you probably shouldn't be here.</p>
        <LoginForm />
      </Layout>
    </div>
  );
}
