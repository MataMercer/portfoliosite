import { useCallback, useEffect, useState } from 'react';
import { IProjectEntry } from '../../ModelTypes/interfaces';
import {
  createProjectEntryRequest,
  deleteProjectEntryRequest,
  getProjectEntriesRequest,
  getProjectEntryRequest,
  updateProjectEntryRequest,
} from '../repositories/ProjectEntryRepository';
import useGenericRequest from './util/useGenericRequest';

type UseProjectEntryProps = {
  initialLoad?: boolean;
  projectEntryId?: string;
};

function useProjectEntry({
  initialLoad,
  projectEntryId,
}: UseProjectEntryProps) {
  const [projectEntries, setProjectEntries] = useState<IProjectEntry[]>([]);
  const [projectEntry, setProjectEntry] = useState<IProjectEntry>();
  const { status, errors, callRequest } = useGenericRequest();
  useEffect(() => {
    if (initialLoad && !projectEntryId) {
      callRequest(getProjectEntriesRequest()).then((res) => {
        setProjectEntries(res);
      });
    }
  }, [callRequest, initialLoad, projectEntryId]);

  useEffect(() => {
    if (initialLoad && projectEntryId) {
      callRequest(getProjectEntryRequest(projectEntryId)).then((res) => {
        setProjectEntry(res);
      });
    }
  }, [projectEntryId, initialLoad, callRequest]);

  const createProjectEntry = useCallback(
    (projectEntryData: IProjectEntry) => {
      return callRequest(createProjectEntryRequest(projectEntryData));
    },
    [callRequest]
  );

  const updateProjectEntry = useCallback(
    (projectEntryData: IProjectEntry) => {
      return callRequest(updateProjectEntryRequest(projectEntryData));
    },
    [callRequest]
  );

  const deleteProjectEntry = useCallback(
    (projectEntryToBeDeletedId: string) => {
      return callRequest(deleteProjectEntryRequest(projectEntryToBeDeletedId));
    },
    [callRequest]
  );

  return {
    projectEntries,
    projectEntry,
    createProjectEntry,
    updateProjectEntry,
    deleteProjectEntry,
    status,
    errors,
  };
}

export default useProjectEntry;
