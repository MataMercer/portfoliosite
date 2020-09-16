import firebase from 'firebase';
import { IProjectEntry } from '../../ModelTypes/interfaces';

const getProjectEntry = async (projectEntryId: string) => {
  const doc = await firebase
    .firestore()
    .collection('projectentries')
    .doc(projectEntryId)
    ?.get();
  if (doc.exists && doc) {
    const projectEntry = doc.data() as IProjectEntry;
    return projectEntry;
  }
  return null;
};
const getProjectEntries = async () => {
  const querySnapshot = await firebase
    .firestore()
    .collection('projectentries')
    .get();
  let tempProjectEntries: IProjectEntry[] = [];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    tempProjectEntries = [...tempProjectEntries, doc.data() as IProjectEntry];
  });
  return tempProjectEntries;
};

const createProjectEntry = (projectEntryData: IProjectEntry) => {
  const projectEntriesRef = firebase.firestore()?.collection('projectentries');
  return projectEntriesRef?.add({
    title: projectEntryData.title,
    introDescription: projectEntryData.introDescription,
    description: projectEntryData.description,
    repoLink: projectEntryData.repoLink,
    demoLink: projectEntryData.demoLink,
    pictureUrls: projectEntryData.pictureUrls,
  });
};

const updateProjectEntry = (projectEntryData: IProjectEntry) => {
  const projectEntriesRef = firebase
    .firestore()
    ?.collection('projectentries')
    .doc(projectEntryData.id);
  return projectEntriesRef?.set({
    title: projectEntryData.title,
    introDescription: projectEntryData.introDescription,
    description: projectEntryData.description,
    repoLink: projectEntryData.repoLink,
    demoLink: projectEntryData.demoLink,
    pictureUrls: projectEntryData.pictureUrls,
  });
};

const deleteProjectEntry = (idToDelete: string) => {
  return firebase
    .firestore()
    ?.collection('projectentries')
    .doc(idToDelete)
    .delete();
};
export {
  getProjectEntry,
  getProjectEntries,
  createProjectEntry,
  updateProjectEntry,
  deleteProjectEntry,
};
