import { useEffect } from 'react';
import { Button, Form, Spinner } from 'reactstrap';
import Router from 'next/router';
import { useForm, Controller } from 'react-hook-form';
import MarkdownEditorInput from '../inputs/MarkdownEditorInput';
import useAboutPage from '../../firebase/hooks/useAboutPage';
import ErrorAlert from '../ErrorAlert';

type AboutFormData = {
  aboutPageInput: string;
};

export default function AboutForm() {
  const { aboutPage, updateAboutPage, status, errors } = useAboutPage();
  const { setValue, control, handleSubmit } = useForm<AboutFormData>({
    criteriaMode: 'all',
  });

  useEffect(() => {
    setValue('aboutPageInput', aboutPage);
  }, [aboutPage, setValue]);

  const onSubmit = handleSubmit((data) => {
    updateAboutPage(data.aboutPageInput).then(() => {
      Router.push('/admindashboard');
    });
  });

  return (
    <>
      <Form onSubmit={onSubmit}>
        <ErrorAlert errors={errors} />
        <Controller
          name="aboutPageInput"
          control={control}
          defaultValue={aboutPage}
          render={({ field }) => (
            <MarkdownEditorInput
              label="About Page Content"
              id="aboutPageInput"
              text={field.value}
              handleTextChange={field.onChange}
            />
          )}
        />
        <Button color="primary" type="submit" disabled={status === 'loading'}>
          Save
        </Button>
        {status === 'loading' ? <Spinner /> : null}
      </Form>
    </>
  );
}
