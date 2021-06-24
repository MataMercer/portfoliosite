import { db } from '../config';

const getAllTags = async () => {
  const querySnapshot = await db.collection('tags').get();
  let tempTags: string[] = [];
  querySnapshot.forEach((doc) => {
    if (doc.data().name) {
      tempTags = [...tempTags, doc.data().name];
    }
  });
  return tempTags;
};

// eslint-disable-next-line import/prefer-default-export
export { getAllTags };
