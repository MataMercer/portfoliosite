import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { v4 as uuid } from 'uuid';
import { storage } from '../config';

const uploadFileRequest = async (fileToUpload: File) => {
  const storageRef = ref(storage, `${uuid()}-${fileToUpload.name}`);
  await uploadBytes(storageRef, fileToUpload);
  const url = await getDownloadURL(storageRef);
  return url;
};

const deleteFileRequest = async (url: string) => {
  await deleteObject(ref(storage, url));
  return url;
};

export { uploadFileRequest, deleteFileRequest };
