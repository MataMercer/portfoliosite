import { v4 as uuid } from 'uuid';
import { storage } from '../config';

const uploadFileRequest = async (fileToUpload: File) => {
  const storageRef = storage.ref(`${uuid()}-${fileToUpload.name}`);
  await storageRef.put(fileToUpload);
  const url = await storageRef.getDownloadURL();
  return url;
};

const deleteFileRequest = async (url: string) => {
  await storage.refFromURL(url).delete();
  return url;
};

export { uploadFileRequest, deleteFileRequest };
