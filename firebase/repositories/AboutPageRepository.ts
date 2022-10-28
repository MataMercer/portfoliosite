import { doc, getDoc, setDoc } from '@firebase/firestore/lite';
import { db } from '../config';

async function getAboutPageRequest() {
  const aboutPageRef = doc(db, 'pages', 'about');
  return getDoc(aboutPageRef).then((it) => {
    if (it.exists()) {
      return it?.data()?.content;
    }
    return 'This page is under construction';
  });
}

async function updateAboutPageRequest(content: string) {
  const aboutPageRef = doc(db, 'pages', 'about');
  return setDoc(aboutPageRef, {
    content,
  });
}

export { getAboutPageRequest, updateAboutPageRequest };
