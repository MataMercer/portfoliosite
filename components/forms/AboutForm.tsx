import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Spinner } from 'reactstrap';
import Router from 'next/router';
import { FirebaseError } from 'firebase';
import MarkdownEditorInput from '../inputs/MarkdownEditorInput';
import {
  getAboutPage,
  updateAboutPage,
} from '../../firebase/repositories/AboutPageRepository';
import ErrorAlert from '../ErrorAlert';

function AboutForm() {
  const [aboutText, setAboutText] = useState<string>('');
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'submitting' | 'error'
  >('loading');
  const [errors, setErrors] = useState<FirebaseError[]>([]);

  const handleAboutTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAboutText(e.target.value);
  };

  useEffect(() => {
    if (status === 'loading') {
      getAboutPage()
        .then((res) => {
          setAboutText(res);
          setStatus('idle');
        })
        .catch((err) => {
          setStatus('error');
          setErrors([...errors, err]);
        });
    }
  }, []);

  const handleFormSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    await updateAboutPage(aboutText)
      .then(() => {
        setStatus('idle');
        Router.push('/admindashboard');
      })
      .catch((err) => {
        setErrors([...errors, err]);
        setStatus('error');
      });
  };

  return (
    <>
      <Form onSubmit={handleFormSubmit}>
        <ErrorAlert errors={errors} />
        <MarkdownEditorInput
          label="About Page Content"
          name="aboutText"
          id="aboutText"
          handleTextChange={handleAboutTextChange}
          text={aboutText}
        />

        <Button
          color="primary"
          type="submit"
          disabled={status === 'loading' || status === 'submitting'}
        >
          Save
        </Button>
        {status === 'submitting' ? <Spinner /> : null}
      </Form>
    </>
  );
}

export default AboutForm;
