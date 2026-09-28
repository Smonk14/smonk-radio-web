import "./styles/base.css";
import "./styles/player.css";
import "./styles/chat.css";
import "./styles/rocket-power.css";
import "./styles/responsive.css";
import "./styles/social-links.css";
import "./styles/live.css";

import { createSocialLinks } from "./social/socialLinks";
import { createLiveMode } from "./live/liveView";
import { createChat } from "./chat/chat";
import { createRocketPowerButton } from "./links/rocketPower";
import { createLiveBadge } from "./player/liveBadge";
import { createFavicon } from "./player/favicon";

async function initSmonkRadio() {
  createFavicon();
  createLiveBadge();
  createRocketPowerButton();
  createSocialLinks();
  createLiveMode();
  await createChat();
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initSmonkRadio
  );
} else {
  void initSmonkRadio();
}