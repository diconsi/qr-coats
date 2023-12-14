import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
const firebaseConfig = {
  apiKey: "AIzaSyALRaEnBtswieLGRT7TXediVUuL--Llsqk",
  authDomain: "qr-coats-9f2e2.firebaseapp.com",
  projectId: "qr-coats-9f2e2",
  storageBucket: "qr-coats-9f2e2.appspot.com",
  messagingSenderId: "228173574806",
  appId: "1:228173574806:web:9ecf40200114a9a1d348b7",
};

export const FirebaseApp = initializeApp(firebaseConfig);
export const FirebaseAuth = getAuth(FirebaseApp);
export const FirebaseDB = getFirestore(FirebaseApp);
export const storage = getStorage(FirebaseApp);

export const uploadFiles = async (
  file: Blob | Uint8Array | ArrayBuffer,
  bucket: string
) => {
  const storageRef = ref(storage, `${bucket}/${v4()}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
};
