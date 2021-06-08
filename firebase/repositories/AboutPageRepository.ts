import { db } from '../config';

async function getAboutPageRequest() {
  const aboutPageRef = db.collection('pages').doc('about');
  return aboutPageRef?.get().then((doc) => {
    if (doc.exists) {
      return doc?.data()?.content;
    }
    return 'This page is under construction';
  });
}

async function updateAboutPageRequest(content: string) {
  const aboutPageRef = db.collection('pages').doc('about');
  return aboutPageRef?.set({
    content,
  });
}

export { getAboutPageRequest, updateAboutPageRequest };
