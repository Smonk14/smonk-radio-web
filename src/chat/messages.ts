import {
  limitToLast,
  onChildAdded,
  push,
  query,
  ref,
  serverTimestamp,
} from "firebase/database";

import { database } from "../config/firebase";

import type {
  ChatColor,
  ChatIcon,
} from "./profile";


/* =========================================
   MESSAGE TYPE
========================================= */

export interface ChatMessage {
  uid: string;
  nickname: string;
  message: string;

  color?: ChatColor;
  icon?: ChatIcon;

  timestamp?: number;
}


/* =========================================
   FIREBASE REFERENCE
========================================= */

const messagesRef = ref(
  database,
  "messages"
);


/* =========================================
   ESCUCHAR MENSAJES
========================================= */

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


/* =========================================
   ENVIAR MENSAJE
========================================= */

interface SendMessageParams {
  uid: string;
  nickname: string;
  message: string;
  color: ChatColor;
  icon: ChatIcon;
}

export async function sendMessage({
  uid,
  nickname,
  message,
  color,
  icon,
}: SendMessageParams) {
  const cleanMessage = message
    .trim()
    .substring(0, 250);

  if (!cleanMessage || !nickname) {
    return;
  }

  await push(
    messagesRef,
    {
      uid,
      nickname,
      message: cleanMessage,
      color,
      icon,
      timestamp: serverTimestamp(),
    }
  );
}