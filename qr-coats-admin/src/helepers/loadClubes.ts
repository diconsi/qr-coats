import { FirebaseDB } from "@/firebase/config";
import { collection, getDocs } from "firebase/firestore";

export const loadCLubes = async (uid) => {
  const collectionRef = collection(FirebaseDB, `admin/${uid}/clubes`);
  const clubList = await getDocs(collectionRef);

  const clubes = [];
  clubList.forEach((doc) => {
    clubes.push({ id: doc.id, ...doc.data() });
  });
  return clubes;
};

export const updateClub = (club) => {};
