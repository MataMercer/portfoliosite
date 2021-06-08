// eslint-disable-next-line no-unused-vars
import { FirebaseError } from 'firebase';
import { useCallback, useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { RequestStatus } from '../../ModelTypes/RequestStatus';
import {
  getAboutPageRequest,
  updateAboutPageRequest,
} from '../repositories/AboutPageRepository';
import { db } from '../config';

function useAboutPage() {
  const [aboutPage, setAboutPage] = useState<string>('');
  const [status, setStatus] = useState<RequestStatus>('loading');
  const [errors, setErrors] = useState<FirebaseError[]>([]);

  useEffect(() => {
    if (status === 'loading') {
      getAboutPageRequest()
        .then((res) => {
          setAboutPage(res);
          setStatus('succeeded');
        })
        .catch((err) => {
          setStatus('error');
          setErrors([...errors, err]);
        });
    }
  }, [errors, status]);

  const updateAboutPage = useCallback(
    async (content: string) => {
      setStatus('loading');
      return updateAboutPageRequest(content)
        .then(() => {
          setStatus('succeeded');
        })
        .catch((err) => {
          setErrors([...errors, err]);
          setStatus('error');
        });
    },
    [errors]
  );

  return [aboutPage, updateAboutPage, status, errors] as const;
}
export default useAboutPage;
