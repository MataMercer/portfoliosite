import firebase from 'firebase';

async function getAboutPage() {
  const aboutPageRef = firebase.firestore().collection('pages').doc('about');
  return aboutPageRef?.get().then((doc) => {
    if (doc.exists) {
      return doc?.data()?.content;
    }
    return 'This page is under construction';
  });
}

async function updateAboutPage(content: string) {
  const aboutPageRef = firebase.firestore().collection('pages').doc('about');
  return aboutPageRef?.set({
    content,
  });
}

export { getAboutPage, updateAboutPage };
