export function createLiveBadge() {
  const player = document.querySelector(".card");

  if (!player || document.querySelector("#smonk-live")) {
    return;
  }

  const live = document.createElement("div");

  live.id = "smonk-live";
  live.textContent = "LIVE";

  player.appendChild(live);
}