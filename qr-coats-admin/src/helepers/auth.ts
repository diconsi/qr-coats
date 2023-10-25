import { FirebaseDB } from "@/firebase/config";
import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";

export const loginWithEmailPassword = async ({ email, password }) => {
  const userRef = collection(FirebaseDB, "users");
  const q = query(userRef, where("email", "==", email));
  try {
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return {
        ok: false,
        errorMessage: "Usuario no encontrado",
      };
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    userData.id = userDoc.id;
    if (userData.password !== password) {
      return {
        ok: false,
        errorMessage: "Contraseña incorrecta",
      };
    }

    if (userData.rol !== "admin") {
      return {
        ok: false,
        errorMessage: "Usuario sin permisos",
      };
    }

    const adminCollectionRef = collection(FirebaseDB, "admin");
    const adminQuery = query(
      adminCollectionRef,
      where("idUser", "==", userData.id)
    );
    const result = await getDocs(adminQuery);
    if (result.empty) {
      return {
        ok: false,
        errorMessage: "No se encontró un registro de admin para este usuario",
      };
    }

    const adminDoc = result.docs[0];
    const adminData = adminDoc.data();

    const { name } = adminData;
    return {
      ok: true,
      email: email,
      id:adminDoc.id,
      name,
    };
  } catch (error) {
    const errorMessage = error.message;
    return {
      ok: false,
      errorMessage,
    };
  }
};
