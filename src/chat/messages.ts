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
  ChatBadge,
  ChatColor,
} from "./profile";


export interface ChatMessage {
  uid: string;
  nickname: string;
  message: string;
  color?: ChatColor;
  badge?: ChatBadge;
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


interface SendMessageParams {
  uid: string;
  nickname: string;
  message: string;
  color: ChatColor;
  badge: ChatBadge;
}


export async function sendMessage({
  uid,
  nickname,
  message,
  color,
  badge,
}: SendMessageParams) {
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
    color,
    badge,
    timestamp: serverTimestamp(),
  });
}