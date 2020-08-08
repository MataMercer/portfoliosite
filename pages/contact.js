import Layout from "../components/Layout";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";

export default function Contact() {
  return (
    <div>
      <Layout title="Contact">
        <h1 className="title">Contact Form</h1>

        <p>I will try my best to respond within 24 hours. Alternatively, email me directly at developer.mercer@gmail.com.</p>

        <Form action="https://formspree.io/xvowlgvo" method="POST">
          <FormGroup>
            <Label for="name">Name</Label>
            <Input type="text" name="name" id="name" />
          </FormGroup>

          <FormGroup>
            <Label for="email">Email</Label>
            <Input type="email" name="_replyto" id="email" />
          </FormGroup>
          <FormGroup>
            <Label for="exampleText">Message</Label>
            <Input type="textarea" name="message" id="message" />
          </FormGroup>
          <Button color="primary" type="submit">Send</Button>
        </Form>

      </Layout>
    </div>
  );
}
