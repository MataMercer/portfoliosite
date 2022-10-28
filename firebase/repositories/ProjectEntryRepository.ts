import {
  collection,
  getDoc,
  getDocs,
  doc,
  query,
  orderBy,
  writeBatch,
  Transaction,
  runTransaction,
  where,
} from 'firebase/firestore/lite';
import { IProjectEntry } from '../../ModelTypes/interfaces';
import { db } from '../config';

const getProjectEntryRequest = async (projectEntryId: string) => {
  const d = await getDoc(doc(db, 'projectentries', projectEntryId));
  if (d.exists()) {
    return { ...d.data(), id: d.id } as IProjectEntry;
  }
  return null;
};

const getProjectEntriesRequest = async () => {
  const querySnapshot = await getDocs(
    query(collection(db, 'projectentries'), orderBy('updatedAt', 'desc'))
  );
  return querySnapshot.docs.map((it) => {
    return { ...it.data(), id: it.id } as IProjectEntry;
  });
};

const createProjectEntryRequest = (projectEntryData: IProjectEntry) => {
  const projectEntriesRef = doc(db, 'projectentries');

  const batch = writeBatch(db);

  batch.set(projectEntriesRef, {
    title: projectEntryData.title,
    introDescription: projectEntryData.introDescription,
    description: projectEntryData.description,
    repoLink: projectEntryData.repoLink,
    demoLink: projectEntryData.demoLink,
    tags: projectEntryData.tags,
    completionStatus: projectEntryData.completionStatus,
    pictureUrls: projectEntryData.pictureUrls,
    updatedAt: projectEntryData.updatedAt,
  });

  Object.keys(projectEntryData.tags).forEach((tag) => {
    const tagsRef = doc(db, 'tags', tag);
    batch.set(
      tagsRef,
      {
        name: tag,
        projectEntries: { [projectEntriesRef.id]: true },
      },
      { merge: true }
    );
  });

  return batch.commit();
};

// todo merge create and update.
const updateProjectEntryRequest = async (projectEntryData: IProjectEntry) => {
  const projectEntryRef = doc(
    db,
    'projectentries',
    projectEntryData.id as string
  );

  runTransaction(db, async (transaction: Transaction) => {
    // READS
    const projectEntryDoc = await transaction.get(projectEntryRef);

    const existingProjectEntry = projectEntryDoc.data() as IProjectEntry;

    // find tags that will no longer exist after the update
    const unrelatedTags = Object.keys(existingProjectEntry.tags).filter(
      (existingTag) => !(existingTag in projectEntryData.tags)
    );
    const unrelatedTagDocs = await Promise.all(
      unrelatedTags.map((it) => {
        return transaction.get(doc(db, 'tags', it));
      })
    );

    // WRITES

    transaction.set(projectEntryRef, {
      title: projectEntryData.title,
      introDescription: projectEntryData.introDescription,
      description: projectEntryData.description,
      repoLink: projectEntryData.repoLink,
      demoLink: projectEntryData.demoLink,
      tags: projectEntryData.tags,
      completionStatus: projectEntryData.completionStatus,
      pictureUrls: projectEntryData.pictureUrls,
      updatedAt: projectEntryData.updatedAt,
    });

    unrelatedTagDocs.forEach((unrelatedTagDoc) => {
      const unrelatedTag = unrelatedTagDoc?.data();
      const newRelations = unrelatedTag?.projectEntries;
      delete newRelations[projectEntryRef.id];
      if (Object.keys(newRelations).length === 0) {
        transaction.delete(unrelatedTagDoc.ref);
      } else {
        transaction.update(unrelatedTagDoc.ref, {
          projectEntries: newRelations,
        });
      }
    });

    Object.keys(projectEntryData.tags).forEach((it) => {
      const tagsRef = doc(db, 'tags', it);
      transaction.set(
        tagsRef,
        { name: it, projectEntries: { [projectEntryRef.id]: true } },
        { merge: true }
      );
    });
  });
};

const deleteProjectEntryRequest = async (idToDelete: string) => {
  const projectEntryRef = doc(db, 'projectentries', idToDelete);

  const tags = collection(db, 'tags');
  const queryTagsForOrphans = where('projectEntries', '==', {
    [idToDelete]: true,
  });

  const batch = writeBatch(db);
  const orphanedTags = await getDocs(query(tags, queryTagsForOrphans));
  orphanedTags.forEach((it) => {
    batch.delete(it.ref);
  });

  batch.delete(projectEntryRef);

  return batch.commit();
};
export {
  getProjectEntryRequest,
  getProjectEntriesRequest,
  createProjectEntryRequest,
  updateProjectEntryRequest,
  deleteProjectEntryRequest,
};
