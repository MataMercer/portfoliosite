import firebase from 'firebase';
import { useCallback, useEffect, useState } from 'react';
import { IProjectEntry } from '../../ModelTypes/interfaces';
import { RequestStatus } from '../../ModelTypes/RequestStatus';
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
  }, []);

  useEffect(() => {
    if (initialLoad && projectEntryId) {
      callRequest(getProjectEntryRequest(projectEntryId)).then((res) => {
        setProjectEntry(res);
      });
    }
  }, [projectEntryId]);

  const createProjectEntry = useCallback((projectEntryData: IProjectEntry) => {
    return callRequest(createProjectEntryRequest(projectEntryData));
  }, []);

  const updateProjectEntry = useCallback((projectEntryData: IProjectEntry) => {
    console.log(projectEntryData);
    return callRequest(updateProjectEntryRequest(projectEntryData));
  }, []);

  const deleteProjectEntry = useCallback((projectEntryId: string) => {
    return callRequest(deleteProjectEntryRequest(projectEntryId));
  }, []);

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
