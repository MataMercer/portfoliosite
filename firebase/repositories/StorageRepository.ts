import firebase from 'firebase';

const uploadFile = async (fileToUpload: File) => {
  const storageRef = firebase.storage().ref(fileToUpload.name);
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
