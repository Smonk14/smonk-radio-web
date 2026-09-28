import type { LiveConfig } from "./live.types";
import { listenLiveConfig } from "./live";

const LIVE_ID = "smonk-live-show";

function createLiveElement(): HTMLElement {
  const element = document.createElement("section");

  element.id = LIVE_ID;
  element.className = "smonk-live-show";

  element.innerHTML = `
    <div class="smonk-live-show__status">
      <span class="smonk-live-show__dot"></span>
      <span>COMENTARISTA EN VIVO</span>
    </div>

    <div class="smonk-live-show__content">
      <div class="smonk-live-show__icon">🎙️</div>

      <h2 class="smonk-live-show__title"></h2>

      <div class="smonk-live-show__commentators"></div>

      <div class="smonk-live-show__type"></div>

      <p class="smonk-live-show__message"></p>
    </div>
  `;

  return element;
}

function renderLive(config: LiveConfig): void {
  let liveElement = document.getElementById(LIVE_ID);

  if (!config.active) {
    liveElement?.remove();
    return;
  }

  if (!liveElement) {
    liveElement = createLiveElement();

    document.body.appendChild(liveElement);
  }

  const title = liveElement.querySelector(
    ".smonk-live-show__title"
  );

  const commentators = liveElement.querySelector(
    ".smonk-live-show__commentators"
  );

  const type = liveElement.querySelector(
    ".smonk-live-show__type"
  );

  const message = liveElement.querySelector(
    ".smonk-live-show__message"
  );

  if (title) {
    title.textContent = config.title;
  }

  if (commentators) {
    commentators.textContent = config.commentators;
  }

  if (type) {
    type.textContent = config.type;
  }

  if (message) {
    message.textContent = config.message;
  }
}

export function createLiveMode(): void {
  listenLiveConfig((config) => {
    if (!config) {
      document.getElementById(LIVE_ID)?.remove();
      return;
    }

    renderLive(config);
  });
}