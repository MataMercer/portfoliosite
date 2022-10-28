import { useEffect } from 'react';
import Router from 'next/router';
import { TagsInput } from 'react-tag-input-component';
import { useForm, Controller } from 'react-hook-form';
import { Timestamp } from 'firebase/firestore/lite';
import { Button, Form, Spinner } from 'react-bootstrap';
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
  tags: string[];
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
        tags: Object.keys(fetchedProjectEntry.tags),
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
        existingPictureUrls.map((it) => {
          if (!pictureUrls.includes(it)) {
            return deleteFile(it);
          }
          return null;
        })
      );
    };

    const convertReactTagsToFirebaseObject = () => {
      const obj: { [name: string]: true } = {};
      data.tags.forEach((it) => {
        obj[it] = true;
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
          updatedAt: Timestamp.now(),
        });
      } else {
        await createProjectEntry({
          ...data.projectEntryForm,
          tags: convertReactTagsToFirebaseObject(),
          pictureUrls: successUploadedPictureUrls,
          updatedAt: Timestamp.now(),
        });
      }
      Router.push('/admindashboard');
    };
    submit();
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <ErrorAlert
        errors={[
          ...projectEntryErrors,
          ...storageErrors,
          ...tagSuggestionsErrors,
        ]}
      />
      <Form.Group>
        <Form.Label for="title">Title</Form.Label>
        <Controller
          name="projectEntryForm.title"
          control={control}
          defaultValue=""
          render={({ field }) => <Form.Control type="text" {...field} />}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label for="repoLink">Repository Link</Form.Label>
        <Controller
          name="projectEntryForm.repoLink"
          control={control}
          defaultValue=""
          render={({ field }) => <Form.Control type="text" {...field} />}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label for="demoLink">Demo Link</Form.Label>
        <Controller
          name="projectEntryForm.demoLink"
          control={control}
          defaultValue=""
          render={({ field }) => <Form.Control type="text" {...field} />}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label for="completionStatus">Completion Status</Form.Label>
        <Controller
          name="projectEntryForm.completionStatus"
          control={control}
          render={({ field }) => (
            <Form.Select {...field}>
              <option value="inProgress">In Progress</option>
              <option value="onHold">On Hold</option>
              <option value="completed">Completed</option>
            </Form.Select>
          )}
        />
      </Form.Group>
      {/* <Form.Group>
        <Form.Label for="tags">Tags</Form.Label>
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
      </Form.Group> */}
      <Form.Group>
        <Form.Label for="tags">Tags</Form.Label>
        <Controller
          name="tags"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <TagsInput
              value={field.value}
              onChange={(it: string[]) => setValue('tags', it)}
            />
          )}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label for="introDescription">Intro Description</Form.Label>
        <Controller
          name="projectEntryForm.introDescription"
          control={control}
          defaultValue=""
          render={({ field }) => <Form.Control type="text" {...field} />}
        />
      </Form.Group>
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
      <Form.Group>
        <Form.Label for="pictures">Pictures</Form.Label>
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
      </Form.Group>
      <Button color="primary" type="submit" disabled={disabled}>
        save
      </Button>
      {loading ? <Spinner animation="border" /> : null}
    </Form>
  );
}
