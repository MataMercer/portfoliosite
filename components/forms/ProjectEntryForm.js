import React, { createContext, useState, useContext, useEffect } from "react";
import {
  Container,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
} from "reactstrap";
import MarkdownEditorInput from "../inputs/MarkdownEditorInput";
import { useFirebase } from "../../firebase/FirebaseContext";
import UploadInput from "../inputs/UploadInput";

function ProjectEntryForm() {
  const [title, setTitle] = useState();
  const [introDescription, setIntroDescription] = useState();
  const [description, setDescription] = useState();
  const [repoLink, setRepoLink] = useState();
  const [demoLink, setDemoLink] = useState();

  const handleFormSubmit = (e) => {
    e.preventDefault();
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  return (
    <>
      <Form onSubmit={handleFormSubmit}>
        <FormGroup>
          <Label for="title">Title</Label>
          <Input type="text" name="title" id="title" />
        </FormGroup>
        
        <FormGroup>
          <Label for="repoLink">Repository Link</Label>
          <Input type="link" name="repoLink" id="repoLink" />
        </FormGroup>

        <FormGroup>
          <Label for="demoLink">Demo Link</Label>
          <Input type="link" name="demoLink" id="demoLink" />
        </FormGroup>
        <FormGroup>
          <Label for="introDescription">Intro Description</Label>
          <Input type="text" name="introDescription" id="introDescription" />
        </FormGroup>

        <MarkdownEditorInput
          label="Description"
          name="description"
          id="description"
          handleTextChange={handleDescriptionChange}
          text={description}
        />

        <FormGroup>
          <Label for="pictures">Pictures</Label>
          <UploadInput />
        </FormGroup>

        <Button color="primary" type="submit">
          Save
        </Button>
      </Form>
    </>
  );
}

export default ProjectEntryForm;
