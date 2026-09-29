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
   MESSAGE TYPES
========================================= */

export type ChatMessageType =
  | "text"
  | "emote"
  | "gif";


export interface ChatMessage {
  uid: string;
  nickname: string;
  message: string;

  type?: ChatMessageType;

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
   ENVIAR MENSAJE NORMAL
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

      type: "text",

      color,
      icon,

      timestamp: serverTimestamp(),
    }
  );
}


/* =========================================
   ENVIAR EMOTE
========================================= */

interface SendEmoteParams {
  uid: string;
  nickname: string;
  emoteId: string;
  color: ChatColor;
  icon: ChatIcon;
}

export async function sendEmote({
  uid,
  nickname,
  emoteId,
  color,
  icon,
}: SendEmoteParams) {
  if (!emoteId || !nickname) {
    return;
  }

  await push(
    messagesRef,
    {
      uid,
      nickname,

      message: emoteId,

      type: "emote",

      color,
      icon,

      timestamp: serverTimestamp(),
    }
  );
}


/* =========================================
   ENVIAR GIF
========================================= */

interface SendGifParams {
  uid: string;
  nickname: string;
  gifId: string;
  color: ChatColor;
  icon: ChatIcon;
}

export async function sendGif({
  uid,
  nickname,
  gifId,
  color,
  icon,
}: SendGifParams) {
  if (!gifId || !nickname) {
    return;
  }

  await push(
    messagesRef,
    {
      uid,
      nickname,

      message: gifId,

      type: "gif",

      color,
      icon,

      timestamp: serverTimestamp(),
    }
  );
}