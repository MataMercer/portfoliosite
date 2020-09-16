import React, { useState } from 'react';
import { Alert, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { FirebaseError } from 'firebase';

type ErrorAlertProps = {
  errors: FirebaseError[];
};

const ErrorAlert = ({ errors }: ErrorAlertProps) => {
  return (
    <>
      {errors.length > 0
        ? errors.map((err, index) => (
            <Alert key={index} color="danger">
              {err.message}
            </Alert>
          ))
        : null}
    </>
  );
};

export default ErrorAlert;
