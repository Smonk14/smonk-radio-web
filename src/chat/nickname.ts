import {
  get,
  ref,
  remove,
  runTransaction,
  set,
} from "firebase/database";

import { database } from "../config/firebase";

export function normalizeNickname(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.#$[\]/]/g, "")
    .replace(/\s+/g, "_")
    .substring(0, 20);
}

export async function getUserNickname(
  uid: string
): Promise<string | null> {
  const userNicknameRef = ref(
    database,
    `users/${uid}/nickname`
  );

  const snapshot = await get(userNicknameRef);

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.val();
}

interface ReserveNicknameParams {
  uid: string;
  value: string;
  currentNicknameKey?: string;
}

export async function reserveNickname({
  uid,
  value,
  currentNicknameKey = "",
}: ReserveNicknameParams): Promise<{
  nickname: string;
  nicknameKey: string;
}> {
  const cleanNickname = value
    .trim()
    .substring(0, 20);

  const newKey = normalizeNickname(cleanNickname);

  if (cleanNickname.length < 2) {
    throw new Error(
      "El sobrenombre debe tener mínimo 2 caracteres."
    );
  }

  if (newKey.length < 2) {
    throw new Error(
      "Ese sobrenombre no es válido."
    );
  }

  const usernameRef = ref(
    database,
    `usernames/${newKey}`
  );

  const result = await runTransaction(
    usernameRef,
    (currentUid) => {
      if (currentUid === null) {
        return uid;
      }

      if (currentUid === uid) {
        return uid;
      }

      return;
    },
    {
      applyLocally: false,
    }
  );

  if (!result.committed) {
    throw new Error(
      "Este sobrenombre ya está en uso."
    );
  }

  try {
    await set(
      ref(database, `users/${uid}/nickname`),
      cleanNickname
    );

    if (
      currentNicknameKey &&
      currentNicknameKey !== newKey
    ) {
      const oldUsernameRef = ref(
        database,
        `usernames/${currentNicknameKey}`
      );

      const oldSnapshot =
        await get(oldUsernameRef);

      if (
        oldSnapshot.exists() &&
        oldSnapshot.val() === uid
      ) {
        await remove(oldUsernameRef);
      }
    }

    return {
      nickname: cleanNickname,
      nicknameKey: newKey,
    };
  } catch (error) {
    try {
      const reservedSnapshot =
        await get(usernameRef);

      if (
        reservedSnapshot.exists() &&
        reservedSnapshot.val() === uid &&
        newKey !== currentNicknameKey
      ) {
        await remove(usernameRef);
      }
    } catch (cleanupError) {
      console.error(
        "❌ Error limpiando nickname:",
        cleanupError
      );
    }

    throw error;
  }
}