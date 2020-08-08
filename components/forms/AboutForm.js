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
function AboutForm() {
  const [aboutText, setAboutText] = useState();
  const { database } = useFirebase();

  useEffect(() => {
    setAboutText(getAboutPage().content);
  }, []);

  const handleAboutTextChange = (e) => {
    setAboutText(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    updateAboutPage(aboutText);
  };

  async function getAboutPage() {
    const aboutPageRef = database.collection("pages").doc("about");
    aboutPageRef.get().then(function (doc) {
      if (doc.exists) {
        return doc.data();
      } else {
        return "This page is under construction";
      }
    });
  }

  async function updateAboutPage(content) {
    const aboutPageRef = database.collection("pages").doc("about");
    console.log(content);
    return aboutPageRef.set({
      content,
    });
  }

  return (
    <>
      <Form onSubmit={handleFormSubmit}>
        <MarkdownEditorInput
          label="About Page Content"
          name="aboutText"
          id="aboutText"
          handleTextChange={handleAboutTextChange}
          text={aboutText}
        />
        <Button color="primary" type="submit">
          Save
        </Button>
      </Form>
    </>
  );
}

export default AboutForm;
