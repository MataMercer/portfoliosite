import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
// eslint-disable-next-line no-unused-vars
import firebase from 'firebase';
import { useAuth } from '../../auth/auth';
import ErrorAlert from '../ErrorAlert';

export default function LoginForm() {
  const { login } = useAuth();
  const [error, setError] = useState<firebase.FirebaseError>();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleFormSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    login(email, password).catch((loginError) => {
      setError(loginError);
    });
  };

  return (
    <Form onSubmit={handleFormSubmit}>
      <ErrorAlert errors={error ? [error] : []} />
      <FormGroup>
        <Label for="email">Email</Label>
        <Input
          type="email"
          name="email"
          id="email"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
        />
      </FormGroup>
      <FormGroup>
        <Label for="exampleText">Password</Label>
        <Input
          type="password"
          name="password"
          id="password"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
        />
      </FormGroup>
      <Button color="primary" type="submit">
        Login
      </Button>
    </Form>
  );
}
