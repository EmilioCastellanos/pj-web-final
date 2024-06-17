import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

//----------------------- Database Connection/Configuration ----------------------- 
const firebaseConfig = {
    apiKey: "AIzaSyCMfNo-o0gfaJT6FCIfyYmLV_BhgHPXhdA",
    authDomain: "pj-web-8a3b9.firebaseapp.com",
    projectId: "pj-web-8a3b9",
    storageBucket: "pj-web-8a3b9.appspot.com",
    messagingSenderId: "108924975091",
    appId: "1:108924975091:web:241b2297c03ff2a731c486"
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);
const db = getFirestore(app);

export { storage, db };
