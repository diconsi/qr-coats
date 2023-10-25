import { loadLocations, saveLocation } from "@/helepers/location.helpers";
import {
  addLocation,
  deleteLocationById,
  setLocations,
  updateLocation,
} from "./locationSlice";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { FirebaseDB } from "@/firebase/config";

export const startLoadingLocations = () => async (dispatch, getState) => {
  const { uid } = getState().authState;
  const {
    activeClub: { id },
  } = getState().clubState;
  const locations = await loadLocations(uid, id);
  dispatch(setLocations(locations));
};

export const startSaveLocation = (location) => async (dispatch, getState) => {
  const { uid } = getState().authState;
  const {
    activeClub: { id },
  } = getState().clubState;
  const resp = await saveLocation(location, uid, id);
  dispatch(addLocation(resp.locationData));
};

export const startUpdateLocation = (location) => {
  return async (dispatch, getState) => {
    try {
      const {
        activeLocation: { id: idLocation },
      } = getState().locationState;
      const {
        activeClub: { id: IdClub },
      } = getState().clubState;
      const { uid } = getState().authState;

      const locationRef = doc(
        FirebaseDB,
        `admin/${uid}/clubes/${IdClub}/locations`,
        idLocation
      );

      await updateDoc(locationRef, location);
      dispatch(updateLocation({ id: idLocation, ...location }));
    } catch (error) {
      console.log("aqui", error);
    }
  };
};

export const startDeletingLocation = () => {
  return async (dispatch, getState) => {
    const { uid } = getState().authState;
    const {
      activeLocation: { id: idLocation },
    } = getState().locationState;

    const {
      activeClub: { id: IdClub },
    } = getState().clubState;

    const locationRef = doc(
      FirebaseDB,
      `admin/${uid}/clubes/${IdClub}/locations/${idLocation}`
    );
    await deleteDoc(locationRef);
    dispatch(deleteLocationById(idLocation));
  };
};
