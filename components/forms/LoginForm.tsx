import { ChangeEvent, useState } from 'react';
import { FirebaseError } from 'firebase/app';
import { Button, Form } from 'react-bootstrap';
import { useAuth } from '../../auth/auth';
import ErrorAlert from '../ErrorAlert';

export default function LoginForm() {
  const { login } = useAuth();
  const [error, setError] = useState<FirebaseError>();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleFormSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    login(email, password).catch((loginError) => {
      setError(loginError);
    });
  };

  return (
    <Form onSubmit={handleFormSubmit}>
      <ErrorAlert errors={error ? [error] : []} />
      <Form.Group>
        <Form.Label for="email">Email</Form.Label>
        <Form.Control
          type="email"
          name="email"
          id="email"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
        />
      </Form.Group>
      <Form.Group>
        <Form.Label for="exampleText">Password</Form.Label>
        <Form.Control
          type="password"
          name="password"
          id="password"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
        />
      </Form.Group>
      <Button color="primary" type="submit">
        Login
      </Button>
    </Form>
  );
}
