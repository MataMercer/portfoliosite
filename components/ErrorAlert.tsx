import React from 'react';
import { Alert } from 'reactstrap';
import firebase from 'firebase';

type ErrorAlertProps = {
  errors: firebase.FirebaseError[];
};

const ErrorAlert = ({ errors }: ErrorAlertProps) => {
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
};

export default ErrorAlert;
