import React, { useEffect } from 'react';
import { Button, Form, FormGroup, Label, Input, Spinner } from 'reactstrap';
import Router from 'next/router';
import firebase from 'firebase';
import { WithContext as ReactTags, Tag } from 'react-tag-input';
import { useForm, Controller } from 'react-hook-form';
import { timestamp } from '../../firebase/config';
import MarkdownEditorInput from '../inputs/MarkdownEditorInput';
import UploadInput, { FileInput } from '../inputs/UploadInput';
import { IProjectEntry } from '../../ModelTypes/interfaces';
import ErrorAlert from '../ErrorAlert';
import useStorage from '../../firebase/hooks/useStorage';
import useProjectEntry from '../../firebase/hooks/useProjectEntry';
import useTags from '../../firebase/hooks/useTags';

type ProjectEntryFormProps = {
  projectEntryId: string;
};

type ProjectEntryFormData = {
  projectEntryForm: IProjectEntry;
  pictureFiles: FileInput[];
  reactTags: Tag[];
};

export default function ProjectEntryForm({
  projectEntryId,
}: ProjectEntryFormProps) {
  const { reset, setValue, control, handleSubmit } =
    useForm<ProjectEntryFormData>({
      criteriaMode: 'all',
    });

  const {
    uploadFile,
    deleteFile,
    errors: storageErrors,
    status: storageStatus,
  } = useStorage();

  const {
    projectEntry: fetchedProjectEntry,
    createProjectEntry,
    updateProjectEntry,
    errors: projectEntryErrors,
    status: projectEntryStatus,
  } = useProjectEntry({
    initialLoad: !!projectEntryId,
    projectEntryId,
  });

  const {
    tags: tagSuggestions,
    errors: tagSuggestionsErrors,
    status: tagSuggestionsStatus,
  } = useTags({ initialLoad: true });

  const disabled =
    storageStatus === 'loading' ||
    projectEntryStatus === 'loading' ||
    tagSuggestionsStatus === 'loading';

  const loading =
    storageStatus === 'loading' || projectEntryStatus === 'loading';

  useEffect(() => {
    if (fetchedProjectEntry) {
      reset({
        projectEntryForm: fetchedProjectEntry,
        pictureFiles: fetchedProjectEntry.pictureUrls.map((url) => ({ url })),
        reactTags: Object.keys(fetchedProjectEntry.tags).map((tagName) => ({
          id: tagName,
          text: tagName,
        })),
      });
    }
  }, [projectEntryId, fetchedProjectEntry, reset]);

  const onSubmit = (data: ProjectEntryFormData) => {
    const { pictureFiles } = data;

    const uploadPictures = async (picturesToUpload: File[]) => {
      return Promise.all(
        picturesToUpload.map((picture: File) => uploadFile(picture))
      );
    };

    const deletePictures = async () => {
      const existingPictureUrls = fetchedProjectEntry?.pictureUrls;
      if (!existingPictureUrls) {
        return null;
      }
      const pictureUrls = pictureFiles
        .filter((files) => !files.data)
        .map((file) => file.url);
      return Promise.all(
        existingPictureUrls.map((existingPictureUrl) => {
          if (!pictureUrls.includes(existingPictureUrl)) {
            return deleteFile(existingPictureUrl);
          }
          return null;
        })
      );
    };

    const convertReactTagsToFirebaseObject = () => {
      const obj: { [name: string]: true } = {};
      data.reactTags.forEach((reactTag) => {
        obj[reactTag.id] = true;
      });
      return obj;
    };

    const submit = async () => {
      const filesToUpload = pictureFiles
        .map((file) => file.data)
        .filter((file) => file) as File[];
      const successUploadedPictureUrls = await uploadPictures(filesToUpload);
      await deletePictures();

      const fileUrlsToKeep = pictureFiles
        .filter((file) => !file.data)
        .map((file) => file.url);

      if (projectEntryId && fetchedProjectEntry) {
        await updateProjectEntry({
          ...data.projectEntryForm,
          tags: convertReactTagsToFirebaseObject(),
          pictureUrls: [...fileUrlsToKeep, ...successUploadedPictureUrls],
          updatedAt: timestamp() as firebase.firestore.Timestamp,
        });
      } else {
        await createProjectEntry({
          ...data.projectEntryForm,
          tags: convertReactTagsToFirebaseObject(),
          pictureUrls: successUploadedPictureUrls,
          updatedAt: timestamp() as firebase.firestore.Timestamp,
        });
      }
      Router.push('/admindashboard');
    };
    submit();
  };

  const KeyCodes = {
    comma: 188,
    enter: 13,
  };
  const delimiters = [KeyCodes.comma, KeyCodes.enter];
  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <ErrorAlert
          errors={[
            ...projectEntryErrors,
            ...storageErrors,
            ...tagSuggestionsErrors,
          ]}
        />
        <FormGroup>
          <Label for="title">Title</Label>
          <Controller
            name="projectEntryForm.title"
            control={control}
            defaultValue=""
            render={({ field }) => <Input type="text" {...field} />}
          />
        </FormGroup>
        <FormGroup>
          <Label for="repoLink">Repository Link</Label>
          <Controller
            name="projectEntryForm.repoLink"
            control={control}
            defaultValue=""
            render={({ field }) => <Input type="text" {...field} />}
          />
        </FormGroup>
        <FormGroup>
          <Label for="demoLink">Demo Link</Label>
          <Controller
            name="projectEntryForm.demoLink"
            control={control}
            defaultValue=""
            render={({ field }) => <Input type="text" {...field} />}
          />
        </FormGroup>
        <FormGroup>
          <Label for="completionStatus">Completion Status</Label>
          <Controller
            name="projectEntryForm.completionStatus"
            control={control}
            render={({ field }) => (
              <Input type="select" {...field}>
                <option value="inProgress">In Progress</option>
                <option value="onHold">On Hold</option>
                <option value="completed">Completed</option>
              </Input>
            )}
          />
        </FormGroup>
        <FormGroup>
          <Label for="tags">Tags</Label>
          <Controller
            name="reactTags"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <ReactTags
                id="tags"
                tags={field.value}
                handleAddition={(tag) => {
                  setValue('reactTags', [...field.value, tag]);
                }}
                handleDelete={(i) => {
                  setValue(
                    'reactTags',
                    field.value.filter((tag, index) => index !== i)
                  );
                }}
                handleDrag={(tag, currPos, newPos) => {
                  const newTags = field.value.slice();
                  newTags.splice(currPos, 1);
                  newTags.splice(newPos, 0, tag);
                  setValue('reactTags', newTags);
                }}
                delimiters={delimiters}
                suggestions={tagSuggestions.map((tag) => ({
                  id: tag,
                  text: tag,
                }))}
              />
            )}
          />
        </FormGroup>
        <FormGroup>
          <Label for="introDescription">Intro Description</Label>
          <Controller
            name="projectEntryForm.introDescription"
            control={control}
            defaultValue=""
            render={({ field }) => <Input type="text" {...field} />}
          />
        </FormGroup>
        <Controller
          name="projectEntryForm.description"
          control={control}
          defaultValue={fetchedProjectEntry?.description}
          render={({ field }) => (
            <MarkdownEditorInput
              label="Description"
              id="description"
              handleTextChange={field.onChange}
              text={field.value}
            />
          )}
        />
        <FormGroup>
          <Label for="pictures">Pictures</Label>
          <Controller
            name="pictureFiles"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <UploadInput
                id="pictures"
                setFileInputs={(files: FileInput[]) => {
                  setValue('pictureFiles', files);
                }}
                fileInputs={field.value}
              />
            )}
          />
        </FormGroup>
        <Button color="primary" type="submit" disabled={disabled}>
          save
        </Button>
        {loading ? <Spinner /> : null}
      </Form>
    </>
  );
}
