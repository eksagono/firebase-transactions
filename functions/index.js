const admin = require("firebase-admin");
const functions = require("firebase-functions");

admin.initializeApp();

const firestore = admin.firestore();

const settingsCollectionRef = firestore.collection('settings');
const rootDocumentRef = settingsCollectionRef.doc('root');

exports.onCreateDocument = functions.firestore
  .document('demo/{demo}')
  .onCreate(async (snapshot, context) => {
    try {
      await firestore.runTransaction(async t => {
        const root = await t.get(rootDocumentRef);
        const counter = root.data().counter + 1;
        t.update(rootDocumentRef, { counter });
        t.update(snapshot.ref, { id: counter });
      });
    } catch (error) { console.log('onCreateDocument', error) }
  });