import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FireBaseApp_ApiKey,
  authDomain: process.env.REACT_APP_FireBaseApp_AuthDomain,
  projectId: process.env.REACT_APP_FireBaseApp_ProjectId,
  storageBucket: process.env.REACT_APP_FireBaseApp_StorageBucket,
  messagingSenderId: process.env.REACT_APP_FireBaseApp_MessagingSenderId,
  appId: process.env.REACT_APP_FireBaseApp_AppId,
  measurementId: process.env.REACT_APP_FireBaseApp_MeasurementId
};


const app = initializeApp(firebaseConfig);

export const db = getFirestore();
export const storage = getStorage();
export const auth = getAuth();

export default app;