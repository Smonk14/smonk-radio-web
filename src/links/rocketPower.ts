export function createRocketPowerButton() {
  if (document.querySelector("#rocket-power-link")) {
    return;
  }

  const rocketButton = document.createElement("a");

  rocketButton.id = "rocket-power-link";
  rocketButton.href =
    "https://rocket-power-cards.vercel.app/";

  rocketButton.target = "_blank";
  rocketButton.rel = "noopener noreferrer";

  rocketButton.innerHTML = `
    <span class="rocket-icon">🚀</span>
    <span>ROCKET POWER</span>
  `;

  document.body.appendChild(rocketButton);
}