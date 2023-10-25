import { FirebaseDB } from "@/firebase/config";
import { addDoc, collection } from "firebase/firestore";


export const startSaveGuestInformation = (guestInformation) => {
  return async (dispatch, getState) => {
    const { uid } = getState().authState;
    const {
      activeClub: { id, adminId },
    } = getState().clubState;

    const guestData = {};
    guestInformation.forEach((element) => {
      guestData[element.name] = element.value;
    });
    guestData.idUser = uid;

    const ref = `admin/${adminId}/clubes/${id}/guestInformation`;
    const guestCollectionRef = collection(FirebaseDB, ref);
    try {
      const newGuest = await addDoc(guestCollectionRef, guestData);
      console.log(newGuest.id);
    } catch (error) {
      console.log(error);
    }
  };
};


