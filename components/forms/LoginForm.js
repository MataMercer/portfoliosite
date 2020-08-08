import Layout from "../../components/Layout";
import React, { createContext, useState, useContext, useEffect } from "react";
import {
  Alert,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
} from "reactstrap";
import { useAuth } from "../../auth/auth";
export default function LoginForm() {
  const { login } = useAuth();
  const [error, setError] = useState(null);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const email = e.target.elements["email"].value;
    const password = e.target.elements["password"].value;

    login(email, password).catch(function (error) {
      setError(error);
    });
  };

  return (
    <Form onSubmit={handleFormSubmit}>
      {error ? <Alert color="danger">{error.message}</Alert> : null}

      <FormGroup>
        <Label for="email">Email</Label>
        <Input type="email" name="email" id="email" />
      </FormGroup>
      <FormGroup>
        <Label for="exampleText">Password</Label>
        <Input type="password" name="password" id="password" />
      </FormGroup>
      <Button color="primary" type="submit">
        Login
      </Button>
    </Form>
  );
}
