import firebase from 'firebase';

const getAllTags = async () => {
  const querySnapshot = await firebase
    .firestore()
    .collection('projectentries')
    .get();
  let tempTags: string[] = [];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    tempTags = [...tempTags, doc.data()];
  });
  return tempTags;
};
