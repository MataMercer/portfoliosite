import React from 'react';
import { Spinner } from 'reactstrap';
import { RequestStatus } from '../ModelTypes/RequestStatus';

type CenterSpinnerProps = {
  status: RequestStatus;
};
export default function CenterSpinner({ status }: CenterSpinnerProps) {
  return (
    <div className="center-spinner">
      {status === 'loading' ? <Spinner /> : null}
    </div>
  );
}
