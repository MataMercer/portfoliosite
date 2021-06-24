import { IProjectEntry } from '../../ModelTypes/interfaces';
import { db } from '../config';

const getProjectEntryRequest = async (projectEntryId: string) => {
  const doc = await db.collection('projectentries').doc(projectEntryId).get();
  if (doc.exists && doc) {
    return { ...doc.data(), id: doc.id } as IProjectEntry;
  }
  return null;
};
const getProjectEntriesRequest = async () => {
  const querySnapshot = (
    await db
      .collection('projectentries')
      .orderBy('updatedAt', 'desc')
      .get({ source: 'server' })
  ).docs;
  return querySnapshot.map((doc) => {
    return { ...doc.data(), id: doc.id } as IProjectEntry;
  });
};

const createProjectEntryRequest = (projectEntryData: IProjectEntry) => {
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
    updatedAt: projectEntryData.updatedAt,
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
const updateProjectEntryRequest = async (projectEntryData: IProjectEntry) => {
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

const deleteProjectEntryRequest = async (idToDelete: string) => {
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
  getProjectEntryRequest,
  getProjectEntriesRequest,
  createProjectEntryRequest,
  updateProjectEntryRequest,
  deleteProjectEntryRequest,
};
