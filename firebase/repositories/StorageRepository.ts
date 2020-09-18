import firebase from 'firebase';
import { v4 as uuid } from 'uuid';

const uploadFile = async (fileToUpload: File) => {
  const storageRef = firebase.storage().ref(`${uuid()}-${fileToUpload.name}`);
  await storageRef.put(fileToUpload);
  const url = await storageRef.getDownloadURL();
  return url;
};

const deleteFile = (url: string) => {
  return firebase
    .storage()
    .refFromURL(url)
    .delete()
    .then(() => url);
};

export { uploadFile, deleteFile };
