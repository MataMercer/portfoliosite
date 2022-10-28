/* eslint-disable react/jsx-no-useless-fragment */
import { FirebaseError } from 'firebase/app';
import { Alert } from 'react-bootstrap';

type ErrorAlertProps = {
  errors: FirebaseError[];
};

function ErrorAlert({ errors }: ErrorAlertProps) {
  return (
    <>
      {errors.length > 0
        ? errors.map((err, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <Alert key={index} color="danger">
              {err.message}
            </Alert>
          ))
        : null}
    </>
  );
}

export default ErrorAlert;
