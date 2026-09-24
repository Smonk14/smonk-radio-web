import {
  limitToLast,
  onChildAdded,
  push,
  query,
  ref,
  serverTimestamp,
} from "firebase/database";

import { database } from "../config/firebase";

export interface ChatMessage {
  uid: string;
  nickname: string;
  message: string;
  timestamp?: number;
}

const messagesRef = ref(
  database,
  "messages"
);

export function listenToMessages(
  callback: (message: ChatMessage) => void
) {
  const lastMessages = query(
    messagesRef,
    limitToLast(50)
  );

  return onChildAdded(
    lastMessages,
    (snapshot) => {
      const data =
        snapshot.val() as ChatMessage | null;

      if (!data) {
        return;
      }

      callback(data);
    }
  );
}

export async function sendMessage(
  uid: string,
  nickname: string,
  message: string
) {
  const cleanMessage = message
    .trim()
    .substring(0, 250);

  if (!cleanMessage || !nickname) {
    return;
  }

  await push(messagesRef, {
    uid,
    nickname,
    message: cleanMessage,
    timestamp: serverTimestamp(),
  });
}