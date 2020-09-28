import { v4 as uuid } from 'uuid';
import { storage } from '../config';

const uploadFile = async (fileToUpload: File) => {
  const storageRef = storage.ref(`${uuid()}-${fileToUpload.name}`);
  await storageRef.put(fileToUpload);
  const url = await storageRef.getDownloadURL();
  return url;
};

const deleteFile = (url: string) => {
  return storage
    .refFromURL(url)
    .delete()
    .then(() => url);
};

export { uploadFile, deleteFile };
