import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInAnonymously,
  signInWithPopup,
  type User,
} from "firebase/auth";

import { auth } from "../config/firebase";

const googleProvider =
  new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

export function getCurrentUser(): User | null {
  return auth.currentUser;
}

export function waitForAuth(): Promise<User | null> {
  return new Promise((resolve) => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        (user) => {
          unsubscribe();
          resolve(user);
        }
      );
  });
}

export async function loginAsGuest(): Promise<User> {
  const credential =
    await signInAnonymously(auth);

  return credential.user;
}

export async function loginWithGoogle(): Promise<User> {
  try {
    const credential =
      await signInWithPopup(
        auth,
        googleProvider
      );

    return credential.user;
  } catch (error) {
    console.error(
      "Google login error:",
      error
    );

    throw error;
  }
}