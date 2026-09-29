import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";

import { auth } from "../config/firebase";

export const ADMIN_UID =
  "D1hLxNSppNTNoWx7msW2IjqPmao2";

export function isAdmin(user: User | null): boolean {
  return user?.uid === ADMIN_UID;
}

export function listenAdminAuth(
  callback: (user: User | null) => void
) {
  return onAuthStateChanged(auth, callback);
}

export async function loginAdmin(
  email: string,
  password: string
) {
  const credential =
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

  if (!isAdmin(credential.user)) {
    await signOut(auth);

    throw new Error("Usuario no autorizado");
  }

  return credential.user;
}

export async function logoutAdmin() {
  await signOut(auth);
}