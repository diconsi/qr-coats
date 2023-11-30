import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";

import { login, logout } from "@/store/auth/authSlice";
import { useAppDispatch, useAppSelector } from ".";
import { FirebaseAuth } from "../firebase/config";

export const useCheckAuth = () => {
  const { status } = useAppSelector((store) => store.authState);
  const dispatch = useAppDispatch();

  useEffect(() => {
    onAuthStateChanged(FirebaseAuth, async (user) => {
      if (!user) return dispatch(logout({}));
      const { uid, email, displayName, photoURL } = user;
      dispatch(login({ uid, email, displayName, photoURL }));
    });
  }, []);

  return status;
};
