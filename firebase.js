import { initializeApp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCvXtB_-pxjM3Q_e5y4BKBHPaB7963SJ_g",
    authDomain: "project-6396783167638380323.firebaseapp.com",
    projectId: "project-6396783167638380323",
    storageBucket: "project-6396783167638380323.firebasestorage.app",
    messagingSenderId: "724606941",
    appId: "1:724606941:web:84243b63e774545b796034"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const wishesCollection = collection(db, "gardenWishes");

window.gardenDB = {
    addWish(name, text) {
        return addDoc(wishesCollection, {
            name,
            text,
            createdAt: serverTimestamp()
        });
    },

    listen(callback, onError) {
        const q = query(wishesCollection, orderBy("createdAt", "asc"));

        return onSnapshot(q, snapshot => {
            const wishes = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            callback(wishes);
        }, onError);
    }
};
window.dispatchEvent(new Event('gardenDBReady'));