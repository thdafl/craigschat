import firebase from 'firebase';
import { firebaseConfig } from './config.js';
import ReduxSagaFirebase from 'redux-saga-firebase'

export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const firebaseDb = firebaseApp.database();
export const firebaseAuth = firebase.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const githubProvider = new firebase.auth.GithubAuthProvider();
export const rsf = new ReduxSagaFirebase(firebaseApp);