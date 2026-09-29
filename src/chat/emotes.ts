const ASSET_URL =
  import.meta.env.DEV
    ? ""
    : "https://smonk-radio-web.vercel.app";

export const CHAT_EMOTES = [
  {
    id: "dinoa",
    src: `${ASSET_URL}/chat/emotes/dinoa.png`,
  },
  {
    id: "dinoguason",
    src: `${ASSET_URL}/chat/emotes/dinoguason.png`,
  },
  {
    id: "dinohappy",
    src: `${ASSET_URL}/chat/emotes/dinohappy.png`,
  },
  {
    id: "dinohelp",
    src: `${ASSET_URL}/chat/emotes/dinohelp.png`,
  },
  {
    id: "dinolove",
    src: `${ASSET_URL}/chat/emotes/dinolove.png`,
  },
  {
    id: "dinommm",
    src: `${ASSET_URL}/chat/emotes/dinommm.png`,
  },
  {
    id: "dinomonknavidad",
    src: `${ASSET_URL}/chat/emotes/dinomonknavidad.png`,
  },
  {
    id: "dinopayaso",
    src: `${ASSET_URL}/chat/emotes/dinopayaso.png`,
  },
  {
    id: "dinosad",
    src: `${ASSET_URL}/chat/emotes/dinosad.png`,
  },
  {
    id: "imposibol",
    src: `${ASSET_URL}/chat/emotes/imposibol.png`,
  },
  {
    id: "komo",
    src: `${ASSET_URL}/chat/emotes/komo.png`,
  },
  {
    id: "smonkjuguito",
    src: `${ASSET_URL}/chat/emotes/smonkjuguito.png`,
  },
  {
    id: "smonkoh",
    src: `${ASSET_URL}/chat/emotes/smonkoh.png`,
  },
  {
    id: "sramonk",
    src: `${ASSET_URL}/chat/emotes/sramonk.png`,
  },
  {
    id: "swagg",
    src: `${ASSET_URL}/chat/emotes/swagg.png`,
  },
  {
    id: "yessir",
    src: `${ASSET_URL}/chat/emotes/yessir.png`,
  },
] as const;


export const CHAT_GIFS = [
  {
    id: "banana",
    src: `${ASSET_URL}/chat/gifs/banana.gif`,
  },
  {
    id: "dinodance",
    src: `${ASSET_URL}/chat/gifs/dinodance.gif`,
  },
  {
    id: "recoon",
    src: `${ASSET_URL}/chat/gifs/recoon.gif`,
  },
  {
    id: "trigerred",
    src: `${ASSET_URL}/chat/gifs/trigerred.gif`,
  },
] as const;


export type ChatEmoteId =
  typeof CHAT_EMOTES[number]["id"];

export type ChatGifId =
  typeof CHAT_GIFS[number]["id"];


export function getChatEmote(
  id: string
) {
  return CHAT_EMOTES.find(
    (emote) => emote.id === id
  );
}


export function getChatGif(
  id: string
) {
  return CHAT_GIFS.find(
    (gif) => gif.id === id
  );
}