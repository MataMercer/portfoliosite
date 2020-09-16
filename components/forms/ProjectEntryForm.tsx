import React, { useState, useEffect, useCallback } from 'react';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Spinner,
  Alert,
} from 'reactstrap';
import Router from 'next/router';
import { FirebaseError } from 'firebase';
import MarkdownEditorInput from '../inputs/MarkdownEditorInput';
import UploadInput from '../inputs/UploadInput';
import { IProjectEntry } from '../../ModelTypes/interfaces';
import {
  getProjectEntry,
  createProjectEntry,
  updateProjectEntry,
} from '../../firebase/repositories/ProjectEntryRepository';
import {
  deleteFile,
  uploadFile,
} from '../../firebase/repositories/StorageRepository';
import ErrorAlert from '../ErrorAlert';

type ProjectEntryFormProps = {
  projectEntryId: string;
};

function ProjectEntryForm({ projectEntryId }: ProjectEntryFormProps) {
  const [title, setTitle] = useState<string>('');
  const [introDescription, setIntroDescription] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [repoLink, setRepoLink] = useState<string>('');
  const [demoLink, setDemoLink] = useState<string>('');

  const [pictures, setPictures] = useState<File[]>([]);
  const [pictureUrls, setPictureUrls] = useState<string[]>([]);
  const [existingPictureUrls, setExistingPictureUrls] = useState<string[]>([]);
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'submitting' | 'error'
  >('loading');
  const [errors, setErrors] = useState<FirebaseError[]>([]);

  const disabled = () => {
    return status === 'submitting' || status === 'loading';
  };

  const handleFormSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);
    setStatus('submitting');
    const uploadPictures = async (picturesToUpload: File[]) => {
      return Promise.all(
        picturesToUpload.map((picture: File) =>
          uploadFile(picture).catch((error: FirebaseError) => error)
        )
      );
    };

    const deletePictures = async () => {
      return Promise.all(
        existingPictureUrls.map((existingPictureUrl) => {
          if (!pictureUrls.includes(existingPictureUrl)) {
            return deleteFile(existingPictureUrl).catch(
              (error: FirebaseError) => error
            );
          }
          return null;
        })
      );
    };

    const asyncSubmit = async () => {
      let errored = false;
      const successUploadedPictureUrls = (
        await uploadPictures(pictures)
      ).filter((url) => {
        if (url instanceof Error) {
          setErrors([...errors, url as FirebaseError]);
          errored = true;
          return false;
        }
        return true;
      });

      // Clean up if errored
      if (errored) {
        successUploadedPictureUrls.forEach((url) => {
          deleteFile(url).catch((err) => {
            setErrors([...errors, err]);
          });
        });
        setStatus('error');
        return;
      }

      const deleteResponses = await deletePictures();
      deleteResponses.forEach((res) => {
        if (res instanceof Error) {
          setErrors([...errors, res as FirebaseError]);
          errored = true;
        } else {
          existingPictureUrls.filter((url) => url === res);
        }
      });

      // clean up if errored.
      if (errored) {
        successUploadedPictureUrls.forEach((url) => {
          deleteFile(url).catch((err) => {
            setErrors([...errors, err]);
          });
        });
        setStatus('error');
        return;
      }

      if (projectEntryId) {
        updateProjectEntry({
          title,
          introDescription,
          description,
          repoLink,
          demoLink,
          pictureUrls: [...pictureUrls, ...successUploadedPictureUrls],
        })
          .then(() => {
            Router.push('/admindashboard');
          })
          .catch((err) => {
            successUploadedPictureUrls.forEach((url) => {
              deleteFile(url).catch((err2) => {
                setErrors([...errors, err2]);
              });
            });

            deleteResponses.forEach((res) => {
              existingPictureUrls.filter((url) => res === url);
            });
            setStatus('error');
            setErrors([...errors, err]);
          });
      } else {
        createProjectEntry({
          title,
          description,
          introDescription,
          repoLink,
          demoLink,
          pictureUrls: successUploadedPictureUrls,
        })
          .then(() => {
            Router.push('/admindashboard');
          })
          .catch((err) => {
            successUploadedPictureUrls.forEach((url) => {
              deleteFile(url).catch((err2) => {
                setErrors([...errors, err2]);
              });
            });

            deleteResponses.forEach((res) => {
              existingPictureUrls.filter((url) => res === url);
            });
            setStatus('error');
            setErrors([...errors, err]);
          });
      }
      setStatus('idle');
    };
    asyncSubmit();
  };

  useEffect(() => {
    if (projectEntryId && status === 'loading') {
      getProjectEntry(projectEntryId)
        .then((projectEntry) => {
          if (projectEntry) {
            setTitle(projectEntry.title);
            setIntroDescription(projectEntry.introDescription);
            setDescription(projectEntry.description);
            setDemoLink(projectEntry.demoLink);
            setRepoLink(projectEntry.repoLink);
            setExistingPictureUrls(projectEntry.pictureUrls);
            setPictureUrls(projectEntry.pictureUrls);
          } else {
            throw new Error('This project entry does not or no longer exists');
          }
        })
        .catch((err) => {
          setErrors([...errors, err]);
        })
        .finally(() => {
          setStatus('idle');
        });
    } else if (status === 'loading') {
      setStatus('idle');
    }
  }, [projectEntryId, status]);
  return (
    <>
      <Form onSubmit={handleFormSubmit}>
        <ErrorAlert errors={errors} />
        <FormGroup>
          <Label for="title">Title</Label>
          <Input
            type="text"
            name="title"
            id="title"
            value={title}
            disabled={disabled()}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
          />
        </FormGroup>

        <FormGroup>
          <Label for="repoLink">Repository Link</Label>
          <Input
            type="text"
            name="repoLink"
            id="repoLink"
            value={repoLink}
            disabled={disabled()}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setRepoLink(e.target.value)
            }
          />
        </FormGroup>

        <FormGroup>
          <Label for="demoLink">Demo Link</Label>
          <Input
            type="text"
            name="demoLink"
            id="demoLink"
            value={demoLink}
            disabled={disabled()}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDemoLink(e.target.value)
            }
          />
        </FormGroup>
        <FormGroup>
          <Label for="introDescription">Intro Description</Label>
          <Input
            type="text"
            name="introDescription"
            id="introDescription"
            value={introDescription}
            disabled={disabled()}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setIntroDescription(e.target.value)
            }
          />
        </FormGroup>

        <MarkdownEditorInput
          label="Description"
          name="description"
          id="description"
          handleTextChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setDescription(e.target.value)
          }
          text={description}
        />

        <FormGroup>
          <Label for="pictures">Pictures</Label>
          <UploadInput
            setPictures={setPictures}
            pictures={pictures}
            setPictureUrls={setPictureUrls}
            pictureUrls={pictureUrls}
          />
        </FormGroup>

        <Button color="primary" type="submit" disabled={disabled()}>
          save
        </Button>
        {status === 'submitting' ? <Spinner /> : null}
      </Form>
    </>
  );
}

export default ProjectEntryForm;
