import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  where,
  setDoc,
} from "firebase/firestore";
import { FirebaseAuth, FirebaseDB } from "./config";

export const googleProvider = new GoogleAuthProvider();

export const singInWhitGoogle = async () => {
  try {
    const result = await signInWithPopup(FirebaseAuth, googleProvider);
    const { displayName, email, photoURL, uid, isAnonymous } = result.user;

    return {
      ok: true,
      displayName,
      email,
      photoURL,
      uid,
      isAnonymous,
    };
  } catch (error) {
    const errorMessage = error.message;
    return {
      ok: false,
      errorMessage,
    };
  }
};

export const registerUserWithEmailPassword = async ({
  displayName,
  email,
  password,
}) => {
  try {
    const resp = await createUserWithEmailAndPassword(
      FirebaseAuth,
      email,
      password
    );
    const { uid, photoURL } = resp.user;
    await updateProfile(FirebaseAuth.currentUser, { displayName });

    return {
      ok: true,
      uid,
      photoURL,
      email,
      displayName,
    };
  } catch (error) {
    const errorMessage = error.message;
    return {
      ok: false,
      errorMessage,
    };
  }
};

export const loginWithEmailPassword = async ({ email, password }) => {
  try {
    const resp = await signInWithEmailAndPassword(
      FirebaseAuth,
      email,
      password
    );
    const { uid, photoURL, displayName, isAnonymous } = resp.user;
    return {
      ok: true,
      uid,
      photoURL,
      email,
      displayName,
      isAnonymous,
    };
  } catch (error) {
    const errorMessage = error.message;
    return {
      ok: false,
      errorMessage,
    };
  }
};

export const loginAnonymously = async () => {
  try {
    const resp = await signInAnonymously(FirebaseAuth);
    const { uid, isAnonymous, photoURL, email, displayName } = resp.user;
    return {
      ok: true,
      uid,
      photoURL,
      email,
      displayName,
      isAnonymous,
    };
  } catch (error) {
    const errorMessage = error.message;
    return {
      ok: false,
      errorMessage,
    };
  }
};

export const logoutFirebase = async () => {
  return await FirebaseAuth.signOut();
};

export const updateProfileUser = async (profile) => {
  const { id } = profile;

  const customerRef = doc(FirebaseDB, "customers", id);
  await setDoc(customerRef, profile, { merge: true });
};

export const createProfile = async (profile: object) => {
  const { uid, displayName, email } = profile;
  const customerRef = collection(FirebaseDB, "customers");
  const q = query(customerRef, where("uid", "==", uid));
  const querySnapshot = await getDocs(q);
  let resp = {};

  if (querySnapshot.empty) {
    const newProfile = { uid, name: displayName, email };
    const docRef = await addDoc(customerRef, newProfile);
    resp = { id: docRef.id, ...newProfile };
  } else {
    querySnapshot.forEach((doc) => {
      resp = { id: doc.id, ...doc.data() };
    });
  }
  return resp;
};

export const createCard = async (card: object, id: string) => {
  const customerRef = doc(FirebaseDB, "customers", id);
  await setDoc(customerRef, card, { merge: true });
};
