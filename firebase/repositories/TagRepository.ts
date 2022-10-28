import { collection, query, getDocs } from 'firebase/firestore/lite';
import { db } from '../config';

const getAllTags = async () => {
  const querySnapshot = await getDocs(query(collection(db, 'tags')));
  let tempTags: string[] = [];
  querySnapshot.docs.forEach((doc) => {
    if (doc.data().name) {
      tempTags = [...tempTags, doc.data().name];
    }
  });
  return tempTags;
};

// eslint-disable-next-line import/prefer-default-export
export { getAllTags };
