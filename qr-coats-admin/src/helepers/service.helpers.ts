import { FirebaseDB } from "@/firebase/config";
import { collection, getDocs } from "firebase/firestore";

interface IService {
  id?: string;
  name?: string;
  price?: number;
  enable?: boolean;
  status?: boolean;
}

export const loadServices = async (uid: string, id: string) => {
  const collectionRef = collection(
    FirebaseDB,
    `admin/${uid}/clubes/${id}/services`
  );
  const servicesList = await getDocs(collectionRef);

  const services: IService[] = [];

  for (const serviceDoc of servicesList.docs) {
    const serviceData = serviceDoc.data();
    serviceData.id = serviceDoc.id;

    services.push(serviceData);
  }

  return services;
};
