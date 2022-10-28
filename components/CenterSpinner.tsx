import { Spinner } from 'react-bootstrap';
import { RequestStatus } from '../ModelTypes/RequestStatus';

type CenterSpinnerProps = {
  status: RequestStatus;
};
export default function CenterSpinner({ status }: CenterSpinnerProps) {
  return (
    <div className="center-spinner">
      {status === 'loading' && <Spinner animation="border" color="primary" />}
    </div>
  );
}
