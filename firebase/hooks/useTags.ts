import { useEffect, useState } from 'react';
import { getAllTags } from '../repositories/TagRepository';
import useGenericRequest from './util/useGenericRequest';

type UseProjectEntryProps = {
  initialLoad?: boolean;
  projectEntryId?: string;
};
function useTags({ initialLoad }: UseProjectEntryProps) {
  const [tags, setTags] = useState<string[]>([]);
  const { status, errors, callRequest } = useGenericRequest();
  useEffect(() => {
    if (initialLoad) {
      callRequest(getAllTags()).then((res) => {
        setTags(res);
      });
    }
  }, []);

  return { tags, status, errors };
}

export default useTags;
