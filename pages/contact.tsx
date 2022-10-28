import { Form, Button } from 'react-bootstrap';
import Layout from '../components/Layout';

export default function Contact() {
  return (
    <div>
      <Layout title="Contact">
        <h1 className="title">Contact Form</h1>

        <p>
          I will try my best to respond within 24 hours. Alternatively, email me
          directly at developer.mercer@gmail.com.
        </p>

        <Form action="https://formspree.io/xvowlgvo" method="POST">
          <Form.Group>
            <Form.Label for="name">Name</Form.Label>
            <Form.Control type="text" name="name" id="name" />
          </Form.Group>

          <Form.Group>
            <Form.Label for="email">Email</Form.Label>
            <Form.Control type="email" name="_replyto" id="email" />
          </Form.Group>
          <Form.Group>
            <Form.Label for="exampleText">Message</Form.Label>
            <Form.Control type="textarea" name="message" id="message" />
          </Form.Group>
          <Button color="primary" type="submit">
            Send
          </Button>
        </Form>
      </Layout>
    </div>
  );
}
