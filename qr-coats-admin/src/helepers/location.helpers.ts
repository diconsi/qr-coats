import { FirebaseDB } from "@/firebase/config";
import {
  addDoc,
  collection,
  getDoc,
  getDocs,
  limit,
  query,
  where,
  orderBy,
} from "firebase/firestore";

interface ILocation {
  id?: string;
  name?: string;
  locationType?: string;
  numberHanges?: number;
  numberSlots?: number;
  status?: boolean;
}

export const loadLocations = async (uid: string, id: string) => {
  const collectionRef = collection(
    FirebaseDB,
    `admin/${uid}/clubes/${id}/locations`
  );
  const locationList = await getDocs(collectionRef);

  const locations: ILocation[] = [];

  for (const locationDoc of locationList.docs) {
    const locationData = locationDoc.data();
    locationData.id = locationDoc.id;

    locations.push(locationData);
  }

  return locations;
};

export const saveLocation = async (
  newLocation: Partial<ILocation>,
  uid: string,
  idClub: string
) => {
  try {
    const { numberHanges,numberSlots } = newLocation;
    const { id, data } = await addLocationAndGetId(newLocation, uid, idClub);
    const refHangers=`admin/${uid}/clubes/${idClub}/hangers`
    const refSlots=`admin/${uid}/clubes/${idClub}/slots`

    await insertHangers(id, numberHanges,refHangers);
    await insertHangers(id, numberSlots,refSlots);

    const locationData = {
      id,
      ...data,
    };

    return { ok: true, locationData };
  } catch (error) {
    const errorMessage = error.message;
    return {
      ok: false,
      errorMessage,
    };
  }
};

const addLocationAndGetId = async (locationData, uid, id) => {
  const locationsRef = collection(
    FirebaseDB,
    `admin/${uid}/clubes/${id}/locations`
  );
  const newLocation = await addDoc(locationsRef, locationData);
  const locationDocSnapshot = await getDoc(newLocation);
  return { id: newLocation.id, data: locationDocSnapshot.data() };
};

const insertHangers = async (idLocation, numHangers,refCollection) => {
  console.log(refCollection)
  const hangersRef = collection(
    FirebaseDB,
    refCollection
  );

  const nextName = await getNextName(idLocation,refCollection);

  for (let index = 0; index < numHangers; index++) {
    const hangerData = {
      idLocation: idLocation,
      name: nextName + index,
      status: false,
      idService: "",
    };

    await addDoc(hangersRef, hangerData);
  }
};

const getNextName = async (idLocation,refCollection) => {
  try {
    const hangersRef = collection(
      FirebaseDB,
      refCollection
    );
    const q = query(
      hangersRef,
      where("idLocation", "==", idLocation),
      orderBy("name", "desc"),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.size === 0) {
      return 1;
    } else {
      const highestName = querySnapshot.docs[0].data().name;
      return highestName + 1;
    }
  } catch (error) {
    console.log(error);
  }
};
