import React, { useState, useEffect, useCallback } from 'react';
import { Button, Form, FormGroup, Label, Input, Spinner } from 'reactstrap';
import Router from 'next/router';
import MarkdownEditorInput from '../inputs/MarkdownEditorInput';
import { useFirebase } from '../../firebase/FirebaseContext';
import UploadInput from '../inputs/UploadInput';
import { IProjectEntry } from '../../types/interfaces';

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
  const { database, storage } = useFirebase();
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    const uploadPictures = async (picturesToUpload: File[]) => {
      const asyncPictureUpload = async (picture: File) => {
        // references
        const storageRef = storage?.ref(picture.name);
        const collectionRef = database?.collection('images');

        await storageRef?.put(picture);
        const url = await storageRef?.getDownloadURL();
        await collectionRef?.add({ url });
        return url;
      };

      return Promise.all(
        picturesToUpload.map((picture: File) => asyncPictureUpload(picture))
      );
    };

    const deletePictures = async () => {
      const asyncPictureDelete = async (pictureUrl: string) => {
        const pictureRef = storage?.refFromURL(pictureUrl);

        // Delete the file
        pictureRef
          ?.delete()
          .then(function () {
            // File deleted successfully
          })
          .catch(function (error) {
            // Uh-oh, an error occurred!
          });
      };
      return Promise.all(
        existingPictureUrls.map((existingPictureUrl) => {
          if (!pictureUrls.includes(existingPictureUrl)) {
            return asyncPictureDelete(existingPictureUrl);
          }
          return null;
        })
      );
    };

    const asyncSubmit = async () => {
      setLoading(true);
      await deletePictures();
      const uploadedPictureUrls = await uploadPictures(pictures);
      if (projectEntryId) {
        const projectEntriesRef = database
          ?.collection('projectentries')
          .doc(projectEntryId);
        projectEntriesRef
          ?.set({
            title,
            introDescription,
            description,
            repoLink,
            demoLink,
            pictureUrls: [...pictureUrls, ...uploadedPictureUrls],
          })
          .then(() => {
            Router.push('/admindashboard');
          });
      } else {
        const projectEntriesRef = database?.collection('projectentries');

        projectEntriesRef
          ?.add({
            title,
            introDescription,
            description,
            repoLink,
            demoLink,
            pictureUrls,
          })
          .then(() => {
            Router.push('/admindashboard');
          });
      }
    };

    asyncSubmit();
  };

  useEffect(() => {
    if (projectEntryId) {
      setLoading(true);
      const projectEntryRef = database
        ?.collection('projectentries')
        .doc(projectEntryId);
      projectEntryRef?.get().then((doc) => {
        if (doc.exists) {
          const projectEntry = doc?.data() as IProjectEntry;
          setTitle(projectEntry?.title);
          setDescription(projectEntry?.description);
          setIntroDescription(projectEntry?.introDescription);
          setExistingPictureUrls(projectEntry?.pictureUrls);
          setPictureUrls(projectEntry?.pictureUrls);
          setDemoLink(projectEntry?.demoLink);
          setRepoLink(projectEntry?.repoLink);
        }
        setLoading(false);
      });
    }
  }, [
    database,
    projectEntryId,
    setDemoLink,
    setRepoLink,
    setDescription,
    setExistingPictureUrls,
  ]);

  return (
    <>
      <Form onSubmit={handleFormSubmit}>
        <FormGroup>
          <Label for="title">Title</Label>
          <Input
            type="text"
            name="title"
            id="title"
            value={title}
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
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

        <Button color="primary" type="submit" disabled={loading}>
          save
        </Button>
        {loading ? <Spinner /> : null}
      </Form>
    </>
  );
}

export default ProjectEntryForm;
