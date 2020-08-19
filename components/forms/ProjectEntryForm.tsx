import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import MarkdownEditorInput from '../inputs/MarkdownEditorInput';
import { useFirebase } from '../../firebase/FirebaseContext';
import UploadInput from '../inputs/UploadInput';

function ProjectEntryForm() {
  const [title, setTitle] = useState<string>('');
  const [introDescription, setIntroDescription] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [repoLink, setRepoLink] = useState<string>('');
  const [demoLink, setDemoLink] = useState<string>('');

  const [pictures, setPictures] = useState<File[]>([]);
  const { database, storage } = useFirebase();

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

    const asyncSubmit = async () => {
      const pictureUrls = await uploadPictures(pictures);
      const projectEntriesRef = database?.collection('projectentries');

      projectEntriesRef?.add({
        title,
        introDescription,
        description,
        repoLink,
        demoLink,
        pictureUrls,
      });
    };

    asyncSubmit();
  };

  return (
    <>
      <Form onSubmit={handleFormSubmit}>
        <FormGroup>
          <Label for="title">Title</Label>
          <Input
            type="text"
            name="title"
            id="title"
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
          <UploadInput setPictures={setPictures} pictures={pictures} />
        </FormGroup>

        <Button color="primary" type="submit">
          Save
        </Button>
      </Form>
    </>
  );
}

export default ProjectEntryForm;
