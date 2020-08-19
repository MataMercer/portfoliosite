import React, { useState, useEffect } from 'react';
import { Button, Form, Input } from 'reactstrap';
import MarkdownEditorInput from '../inputs/MarkdownEditorInput';
import { useFirebase } from '../../firebase/FirebaseContext';

function AboutForm() {
  const [aboutText, setAboutText] = useState<string>('');
  const { database } = useFirebase();

  const handleAboutTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAboutText(e.target.value);
  };

  async function getAboutPage() {
    const aboutPageRef = database?.collection('pages').doc('about');
    return aboutPageRef?.get().then((doc) => {
      if (doc.exists) {
        return doc?.data()?.content;
      }
      return 'This page is under construction';
    });
  }

  useEffect(() => {
    getAboutPage().then((res) => {
      setAboutText(res);
    });
  });

  async function updateAboutPage(content: string) {
    const aboutPageRef = database?.collection('pages').doc('about');
    return aboutPageRef?.set({
      content,
    });
  }

  const handleFormSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateAboutPage(aboutText);
  };

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
