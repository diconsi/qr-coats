import { FirebaseDB } from "@/firebase/config";
import { addDoc, collection, doc, getDoc, getDocs } from "firebase/firestore";

interface IEmployee {
  id: string;
  name?: string;
  gender?: string;
  status?: boolean;
  email?: string;
  password?: string;
}

export const loadEmployees = async (uid: string) => {
  const collectionRef = collection(FirebaseDB, `admin/${uid}/employees`);
  const employeeList = await getDocs(collectionRef);

  const employees: IEmployee[] = [];

  for (const employeeDoc of employeeList.docs) {
    const employeeData = employeeDoc.data();
    const idUser = employeeData.idUser;

    const userDocRef = doc(FirebaseDB, "users", idUser);
    const userDoc = await getDoc(userDocRef);
    const userData = userDoc.data();

    const combinedData = { id: employeeDoc.id, ...employeeData, ...userData };

    employees.push(combinedData);
  }

  return employees;
};

export const saveEmployee = async (
  newEmployee: Partial<IEmployee>,
  uid: string
) => {
  const { email, password, status, ...employeeData } = newEmployee;
  try {
    const userRef = await addDoc(collection(FirebaseDB, "users"), {
      email,
      password,
      status,
      rol: "employed",
    });

    const userDocSnapshot = await getDoc(userRef);

    const userId = userRef.id;

    const employeeDocRef = await addDoc(
      collection(FirebaseDB, `admin/${uid}/employees`),
      {
        ...employeeData,
        idUser: userId,
      }
    );

    const employeeDocSnapshot = await getDoc(employeeDocRef);

    const savedEmployee = {
      id: employeeDocRef.id,
      ...employeeDocSnapshot.data(),
      ...userDocSnapshot.data(),
    };

    return {
      ok: true,
      employeeData: savedEmployee,
    };
  } catch (error) {
    const errorMessage = error.message;
    return {
      ok: false,
      errorMessage,
    };
  }
};
