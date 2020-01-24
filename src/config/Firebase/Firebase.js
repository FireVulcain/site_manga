import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";
import "firebase/storage";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

class Firebase {
    constructor() {
        firebase.initializeApp(firebaseConfig);
        this.auth = firebase.auth();
        this.db = firebase.database();
        this.firestore = firebase.firestore();
        this.storage = firebase.storage();
    }

    doCreateUserWithEmailAndPassword = (email, password) => this.auth.createUserWithEmailAndPassword(email, password);
    doSignInWithEmailAndPassword = (email, password) => this.auth.signInWithEmailAndPassword(email, password);
    doSignOut = () => this.auth.signOut();
    doPasswordReset = (email) => this.auth.sendPasswordResetEmail(email);
    doPasswordUpdate = (password) => this.auth.currentUser.updatePassword(password);

    user = (uid) => this.db.ref(`users/${uid}`);
    users = () => this.db.ref("users");
}

export default Firebase;
