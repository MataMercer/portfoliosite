/* eslint-disable no-console */
import firebase from 'firebase';
import { useCallback, useState } from 'react';
import { RequestStatus } from '../../../ModelTypes/RequestStatus';

function useGenericRequest() {
  const [status, setStatus] = useState<RequestStatus>('idle');
  const [errors, setErrors] = useState<firebase.FirebaseError[]>([]);

  const callRequest = useCallback(
    async (request: Promise<any>) => {
      setStatus('loading');
      console.log('calling request...');
      return request
        .then((res) => {
          setStatus('succeeded');
          console.log('success');
          return res;
        })
        .catch((err) => {
          setErrors([...errors, err]);
          setStatus('error');
        });
    },
    [errors]
  );

  return { status, errors, callRequest };
}
export default useGenericRequest;
