import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, collection, doc, addDoc, setDoc, query, getDocs, orderBy, deleteDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAkkVy0stmZ5GPpi1AIUGoFnd1wIDHJH70",
  authDomain: "admrt-com.firebaseapp.com",
  projectId: "admrt-com",
  storageBucket: "admrt-com.appspot.com",
  messagingSenderId: "12110099340",
  appId: "1:12110099340:web:2b97eefd06159d92eadca9",
  measurementId: "G-0SXGS2RHVJ"
};

const provider = new GoogleAuthProvider();
provider.setCustomParameters({   
    prompt : "select_account "
});

const providerFacebook = new FacebookAuthProvider();

const signInWithGooglePopup = () => signInWithPopup(auth, provider);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = () => signInWithPopup(auth, providerFacebook);
const db = getFirestore(app);
const storage = getStorage(app);
const database = getDatabase(app);
const usersCollection = collection(db, 'users');
const usernameCollection = collection(db, 'username');
const requestCollection = collection(db, 'request');
const portfolioCollection = collection(db, "portfolio");
const productCollection = collection(db, 'products');
const messageCollection = collection(db, 'messages');

export {
  auth,
  googleProvider,
  facebookProvider,
  usersCollection,
  usernameCollection,
  storage,
  db,
  app,
  database,
  requestCollection,
  portfolioCollection,
  messageCollection,
  signInWithGooglePopup,
  productCollection,
};

export async function savePortfolioFirebase(userId, portfolioId, userData) {
  try {
    if (!userData.startDate) {
      throw new Error("startDate field is required");
    }

    const portfolioRef = doc(portfolioCollection, userId, 'portfolios', portfolioId);
    await setDoc(portfolioRef, userData, { merge: true });
    console.log("Portfolio data saved successfully");
  } catch (error) {
    console.error("Error saving portfolio data:", error);
    throw error;
  }
}

export async function deleteMessageFromFirebase(senderId, receiverId) {
  try {
    const documentPath = `messages/${senderId}/${receiverId}`;
    await deleteDoc(doc(db, documentPath));
  } catch (error) {
    console.error("Error deleting message:", error);
    throw error;
  }
}

export async function saveMessageToFirebase(senderId, receiverId, message) {
  try {
    const messagesCollectionRef = collection(db, `messages/${senderId}/${receiverId}`);
    await addDoc(messagesCollectionRef, { senderId, receiverId, message, timestamp: new Date(), seen: false });
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

export async function getMessagesFromFirebase(senderId, receiverId) {
  try {
    const messagesCollectionRef = collection(db, `messages/${senderId}/${receiverId}`);
    const q = query(messagesCollectionRef, orderBy('timestamp'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting messages:', error);
    throw error;
  }
}

export async function saveUserDataToFirebase(userId, userData) {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, userData, { merge: true });
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
}

export async function deletePortfolioFirebase(userId, portfolioId) {
  try {
    const portfolioRef = doc(portfolioCollection, userId, 'portfolios', portfolioId);
    await deleteDoc(portfolioRef);
  } catch (error) {
    console.error("Error deleting portfolio:", error);
    throw error;
  }
}

export async function saveProductDataToFirebase(userId, productId, productData, fileRefs) {
  try {
    const productRef = doc(db, `products/${userId}/all`, productId);  
    await setDoc(productRef, { 
      ...productData, 
      icon: fileRefs[0],
      images: fileRefs.slice(1)
    });
  } catch (error) {
    console.error("Error saving product data:", error);
    throw error;
  }
}

export async function uploadFilesToStorage(userId, productId, icon, files) {
  try {
    const fileRefs = [];

    if (icon) {
      const iconStorageRef = ref(storage, `users/${userId}/product/${productId}/icon/icon.${icon.name.split('.').pop()}`);
      await uploadBytes(iconStorageRef, icon);
      const iconDownloadURL = await getDownloadURL(iconStorageRef);
      fileRefs.push(iconDownloadURL);
    }

    for (const file of files) {
      const storageRef = ref(storage, `users/${userId}/product/${productId}/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      fileRefs.push(downloadURL);
    }

    return fileRefs;
  } catch (error) {
    console.error("Error uploading files:", error);
    throw error;
  }
}