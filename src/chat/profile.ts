import {
  get,
  ref,
  update,
} from "firebase/database";

import { database } from "../config/firebase";

/* =========================================
   COLORES
========================================= */

export const CHAT_COLORS = [
  { id: "red", value: "#ff3b3b" },
  { id: "orange", value: "#ff8a34" },
  { id: "yellow", value: "#ffd43b" },
  { id: "green", value: "#4ade80" },
  { id: "blue", value: "#60a5fa" },
  { id: "purple", value: "#c084fc" },
] as const;


/* =========================================
   ICONOS
========================================= */

export const CHAT_ICONS = [
  /* BALONES */

  {
    id: "ball_blue",
    src: "/chat/balones/azul.png",
    category: "ball",
    label: "Azul",
  },

  {
    id: "ball_diamond",
    src: "/chat/balones/diamante.png",
    category: "ball",
    label: "Diamante",
  },

  {
    id: "ball_gold",
    src: "/chat/balones/dorado.png",
    category: "ball",
    label: "Dorado",
  },

  {
    id: "ball_purple",
    src: "/chat/balones/morado.png",
    category: "ball",
    label: "Morado",
  },

  {
    id: "ball_red",
    src: "/chat/balones/Rojo.png",
    category: "ball",
    label: "Rojo",
  },

  {
    id: "ball_green",
    src: "/chat/balones/verde.png",
    category: "ball",
    label: "Verde",
  },

  /* CARROS */

  {
    id: "car_yellow",
    src: "/chat/carros/amarillo.png",
    category: "car",
    label: "Amarillo",
  },

  {
    id: "car_orange",
    src: "/chat/carros/naranja.png",
    category: "car",
    label: "Naranja",
  },

  {
    id: "car_red",
    src: "/chat/carros/rojo.png",
    category: "car",
    label: "Rojo",
  },

  {
    id: "car_green",
    src: "/chat/carros/verde.png",
    category: "car",
    label: "Verde",
  },

  {
    id: "car_green_blue",
    src: "/chat/carros/verdeAzul.png",
    category: "car",
    label: "Verde Azul",
  },
] as const;


/* =========================================
   TYPES
========================================= */

export type ChatColor =
  typeof CHAT_COLORS[number]["id"];

export type ChatIcon =
  typeof CHAT_ICONS[number]["id"];

export interface ChatProfile {
  color: ChatColor;
  icon: ChatIcon;
}


/* =========================================
   PERFIL DEFAULT
========================================= */

export const DEFAULT_CHAT_PROFILE: ChatProfile = {
  color: "red",
  icon: "ball_blue",
};


/* =========================================
   OBTENER PERFIL
========================================= */

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

  const validColor =
    CHAT_COLORS.some(
      (color) =>
        color.id === data.color
    );

  const validIcon =
    CHAT_ICONS.some(
      (icon) =>
        icon.id === data.icon
    );

  return {
    color: validColor
      ? data.color
      : DEFAULT_CHAT_PROFILE.color,

    icon: validIcon
      ? data.icon
      : DEFAULT_CHAT_PROFILE.icon,
  };
}


/* =========================================
   GUARDAR PERFIL
========================================= */

export async function saveChatProfile(
  uid: string,
  profile: ChatProfile
) {
  const validColor =
    CHAT_COLORS.some(
      (color) =>
        color.id === profile.color
    );

  const validIcon =
    CHAT_ICONS.some(
      (icon) =>
        icon.id === profile.icon
    );

  if (!validColor || !validIcon) {
    throw new Error(
      "Perfil de chat inválido."
    );
  }

  await update(
    ref(database, `users/${uid}`),
    {
      color: profile.color,
      icon: profile.icon,
    }
  );
}


/* =========================================
   OBTENER COLOR
========================================= */

export function getChatColor(
  colorId: string
) {
  return (
    CHAT_COLORS.find(
      (color) =>
        color.id === colorId
    )?.value ?? "#ff3b3b"
  );
}


/* =========================================
   OBTENER ICONO
========================================= */

export function getChatIcon(
  iconId: string
) {
  return (
    CHAT_ICONS.find(
      (icon) =>
        icon.id === iconId
    ) ?? CHAT_ICONS[0]
  );
}