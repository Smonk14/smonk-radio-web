import {
  get,
  ref,
  update,
} from "firebase/database";

import { database } from "../config/firebase";


export const CHAT_COLORS = [
  {
    id: "red",
    value: "#ff3b3b",
  },
  {
    id: "orange",
    value: "#ff8a34",
  },
  {
    id: "yellow",
    value: "#ffd43b",
  },
  {
    id: "green",
    value: "#4ade80",
  },
  {
    id: "blue",
    value: "#60a5fa",
  },
  {
    id: "purple",
    value: "#c084fc",
  },
] as const;


export const CHAT_BADGES = [
  {
    id: "gamer",
    emoji: "🎮",
    label: "Gamer",
  },
  {
    id: "racer",
    emoji: "🏎️",
    label: "Racer",
  },
  {
    id: "dj",
    emoji: "🎧",
    label: "DJ",
  },
  {
    id: "rocket",
    emoji: "🚀",
    label: "Rocket",
  },
  {
    id: "monkey",
    emoji: "🐵",
    label: "Smonk",
  },
  {
    id: "fire",
    emoji: "🔥",
    label: "Fire",
  },
] as const;


export type ChatColor =
  typeof CHAT_COLORS[number]["id"];

export type ChatBadge =
  typeof CHAT_BADGES[number]["id"];


export interface ChatProfile {
  color: ChatColor;
  badge: ChatBadge;
}


export const DEFAULT_CHAT_PROFILE: ChatProfile = {
  color: "red",
  badge: "gamer",
};


export async function getChatProfile(
  uid: string
): Promise<ChatProfile> {
  const snapshot = await get(
    ref(database, `users/${uid}`)
  );

  if (!snapshot.exists()) {
    return DEFAULT_CHAT_PROFILE;
  }

  const data = snapshot.val();

  return {
    color:
      CHAT_COLORS.some(
        (color) => color.id === data.color
      )
        ? data.color
        : DEFAULT_CHAT_PROFILE.color,

    badge:
      CHAT_BADGES.some(
        (badge) => badge.id === data.badge
      )
        ? data.badge
        : DEFAULT_CHAT_PROFILE.badge,
  };
}


export async function saveChatProfile(
  uid: string,
  profile: ChatProfile
) {
  const validColor =
    CHAT_COLORS.some(
      (color) => color.id === profile.color
    );

  const validBadge =
    CHAT_BADGES.some(
      (badge) => badge.id === profile.badge
    );


  if (!validColor || !validBadge) {
    throw new Error(
      "Perfil de chat inválido."
    );
  }


  await update(
    ref(database, `users/${uid}`),
    {
      color: profile.color,
      badge: profile.badge,
    }
  );
}


export function getChatColor(
  colorId: string
) {
  return (
    CHAT_COLORS.find(
      (color) => color.id === colorId
    )?.value ?? "#ff3b3b"
  );
}


export function getChatBadge(
  badgeId: string
) {
  return (
    CHAT_BADGES.find(
      (badge) => badge.id === badgeId
    ) ?? CHAT_BADGES[0]
  );
}