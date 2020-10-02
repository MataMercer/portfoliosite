import React, { useState, useEffect, useCallback } from 'react';
import { Button, Form, FormGroup, Label, Input, Spinner } from 'reactstrap';
import Router from 'next/router';
import { FirebaseError } from 'firebase';

import { WithContext as ReactTags, Tag } from 'react-tag-input';
import { timestamp } from '../../firebase/config';
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
import { getAllTags } from '../../firebase/repositories/TagRepository';

type ProjectEntryFormProps = {
  projectEntryId: string;
};

function ProjectEntryForm({ projectEntryId }: ProjectEntryFormProps) {
  const [title, setTitle] = useState<string>('');
  const [introDescription, setIntroDescription] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [repoLink, setRepoLink] = useState<string>('');
  const [demoLink, setDemoLink] = useState<string>('');
  const [completionStatus, setCompletionStatus] = useState<
    'inProgress' | 'onHold' | 'completed'
  >('inProgress');
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagSuggestions, setTagSuggestions] = useState<Tag[]>([]);
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

    const convertTagsToObject = () => {
      const obj: { [name: string]: true } = {};
      tags.forEach((tag) => {
        obj[tag.id] = true;
      });
      return obj;
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
          id: projectEntryId,
          title,
          introDescription,
          description,
          repoLink,
          demoLink,
          completionStatus,
          tags: convertTagsToObject(),
          pictureUrls: [...pictureUrls, ...successUploadedPictureUrls],
          updatedAt: timestamp() as firebase.firestore.Timestamp,
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
          completionStatus,
          tags: convertTagsToObject(),
          pictureUrls: successUploadedPictureUrls,
          updatedAt: timestamp() as firebase.firestore.Timestamp,
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
    const loadProjectEntry = async () => {
      try {
        const projectEntry = await getProjectEntry(projectEntryId);
        if (projectEntry) {
          setTitle(projectEntry.title);
          setIntroDescription(projectEntry.introDescription);
          setDescription(projectEntry.description);
          setDemoLink(projectEntry.demoLink);
          setRepoLink(projectEntry.repoLink);
          setExistingPictureUrls(projectEntry.pictureUrls);
          setPictureUrls(projectEntry.pictureUrls);
          setCompletionStatus(projectEntry.completionStatus);
          setTags(
            Object.keys(projectEntry.tags).map((tagName) => ({
              id: tagName,
              text: tagName,
            }))
          );
        } else {
          throw new Error('This project entry does not or no longer exists');
        }
      } catch (err) {
        setStatus('error');
        setErrors([...errors, err]);
      }
    };
    const loadTagSuggestions = async () => {
      try {
        const allTags = await getAllTags();

        setTagSuggestions(allTags.map((tag) => ({ id: tag, text: tag })));
      } catch (err) {
        setStatus('error');
        setErrors([...errors, err]);
      }
    };

    if (status === 'loading') {
      if (projectEntryId) {
        Promise.all([loadProjectEntry(), loadTagSuggestions()]).then(() => {
          setStatus('idle');
        });
      } else {
        loadTagSuggestions().then(() => {
          setStatus('idle');
        });
      }
    }
  }, [errors, projectEntryId, status]);

  const KeyCodes = {
    comma: 188,
    enter: 13,
  };
  const delimiters = [KeyCodes.comma, KeyCodes.enter];
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
          <Label for="completionStatus">Completion Status</Label>
          <Input
            type="select"
            name="completionStatus"
            id="completionStatus"
            value={completionStatus}
            disabled={disabled()}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCompletionStatus(
                e.target.value as 'inProgress' | 'onHold' | 'completed'
              )
            }
          >
            <option value="inProgress">In Progress</option>
            <option value="onHold">On Hold</option>
            <option value="completed">Completed</option>
          </Input>
        </FormGroup>

        <FormGroup>
          <Label for="tags">Tags</Label>

          {!disabled() ? (
            <ReactTags
              id="tags"
              tags={tags}
              handleAddition={(tag) => {
                setTags([...tags, tag]);
              }}
              handleDelete={(i) => {
                setTags(tags.filter((tag, index) => index !== i));
              }}
              handleDrag={(tag, currPos, newPos) => {
                const newTags = tags.slice();
                newTags.splice(currPos, 1);
                newTags.splice(newPos, 0, tag);
                setTags(newTags);
              }}
              delimiters={delimiters}
              suggestions={tagSuggestions}
            />
          ) : (
            <Spinner />
          )}
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
            id="pictures"
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
