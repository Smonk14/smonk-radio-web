import { onValue, ref } from "firebase/database";

import { database } from "../config/firebase";
import type { LiveConfig } from "./live.types";

export function listenLiveConfig(
  callback: (config: LiveConfig | null) => void
) {
  const liveRef = ref(database, "liveConfig");

  return onValue(liveRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback(null);
      return;
    }

    callback(snapshot.val() as LiveConfig);
  });
}