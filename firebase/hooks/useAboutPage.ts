import { useCallback, useEffect, useState } from 'react';
import {
  getAboutPageRequest,
  updateAboutPageRequest,
} from '../repositories/AboutPageRepository';
import useGenericRequest from './util/useGenericRequest';

function useAboutPage() {
  const [aboutPage, setAboutPage] = useState<string>('');
  const { status, errors, callRequest } = useGenericRequest();
  useEffect(() => {
    callRequest(getAboutPageRequest()).then((res) => {
      setAboutPage(res);
    });
  }, [callRequest]);

  const updateAboutPage = useCallback(
    (content: string) => {
      return callRequest(updateAboutPageRequest(content));
    },
    [callRequest]
  );

  return { aboutPage, updateAboutPage, status, errors };
}
export default useAboutPage;
