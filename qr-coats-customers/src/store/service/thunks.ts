import { loadServices } from "@/helepers";
import { setServices } from "./serviceSlice";
import { FirebaseDB } from "@/firebase/config";
import { DocumentReference, doc, updateDoc } from "firebase/firestore";

export const startLoadingServices = () => async (dispatch, getState) => {
  const { uid } = getState().authState;
  const {
    activeClub: { id: IdClub },
  } = getState().clubState;
  const services = await loadServices(uid, IdClub);
  dispatch(setServices(services));
};

export const startUpdateSettings = (settings) => {
  return async (dispatch, getState) => {
    try {
      const {
        activeClub: { id },
      } = getState().clubState;
      const { uid } = getState().authState;
      const { serviceData, ...clubPropertys } = settings;

      for (const serviceId in serviceData) {
        if (serviceData.hasOwnProperty(serviceId)) {
          const service = serviceData[serviceId];
          const serviceRef = doc(
            FirebaseDB,
            `admin/${uid}/clubes/${id}/services`,
            service.id
          );
          await updateDoc(serviceRef, service, { merge: true });
        }
      }

      const clubRef = doc(FirebaseDB, `admin/${uid}/clubes`, id);

      await updateDoc(clubRef, { ...clubPropertys }, { merge: true });
    } catch (error) {
      console.log("aqui", error);
    }
  };
};
