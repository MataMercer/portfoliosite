import { IProjectEntry } from '../../ModelTypes/interfaces';
import { db, storage } from '../config';

const getProjectEntry = async (projectEntryId: string) => {
  const doc = await db.collection('projectentries').doc(projectEntryId).get();
  if (doc.exists && doc) {
    return { ...doc.data(), id: doc.id } as IProjectEntry;
  }
  return null;
};
const getProjectEntries = async () => {
  const querySnapshot = (
    await db.collection('projectentries').get({ source: 'server' })
  ).docs;
  return querySnapshot.map((doc) => {
    return { ...doc.data(), id: doc.id } as IProjectEntry;
  });
};

const createProjectEntry = (projectEntryData: IProjectEntry) => {
  const projectEntriesRef = db.collection('projectentries').doc();

  const batch = db.batch();

  batch.set(projectEntriesRef, {
    title: projectEntryData.title,
    introDescription: projectEntryData.introDescription,
    description: projectEntryData.description,
    repoLink: projectEntryData.repoLink,
    demoLink: projectEntryData.demoLink,
    tags: projectEntryData.tags,
    completionStatus: projectEntryData.completionStatus,
    pictureUrls: projectEntryData.pictureUrls,
  });

  Object.keys(projectEntryData.tags).forEach((tag) => {
    const tagsRef = db.collection('tags').doc(tag);
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
const updateProjectEntry = async (projectEntryData: IProjectEntry) => {
  const projectEntryRef = db
    .collection('projectentries')
    .doc(projectEntryData.id);

  db.runTransaction(async (transaction) => {
    // READS
    const projectEntryDoc = await transaction.get(projectEntryRef);

    const existingProjectEntry = projectEntryDoc.data() as IProjectEntry;

    // find tags that will no longer exist after the update
    const unrelatedTags = Object.keys(existingProjectEntry.tags).filter(
      (existingTag) => !(existingTag in projectEntryData.tags)
    );
    const unrelatedTagDocs = await Promise.all(
      unrelatedTags.map((tag) => {
        return transaction.get(db.collection('tags').doc(tag));
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

    Object.keys(projectEntryData.tags).forEach((tag) => {
      const tagsRef = db.collection('tags').doc(tag);
      transaction.set(
        tagsRef,
        { name: tag, projectEntries: { [projectEntryRef.id]: true } },
        { merge: true }
      );
    });
  });
};

const deleteProjectEntry = async (idToDelete: string) => {
  const projectEntryRef = db?.collection('projectentries').doc(idToDelete);

  const tags = db.collection('tags');
  const queryTagsForOrphans = tags.where('projectEntries', '==', {
    [idToDelete]: true,
  });

  const batch = db.batch();
  const orphanedTags = await queryTagsForOrphans.get();
  orphanedTags.forEach((doc) => {
    batch.delete(doc.ref);
  });

  batch.delete(projectEntryRef);

  return batch.commit();
};
export {
  getProjectEntry,
  getProjectEntries,
  createProjectEntry,
  updateProjectEntry,
  deleteProjectEntry,
};
