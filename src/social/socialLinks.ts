const ASSET_URL = "https://smonk-radio-web.vercel.app";

const socialLinks = [
  {
    name: "YouTube",
    url: "https://www.youtube.com/@Smonk14",
    icon: `${ASSET_URL}/social/youtube.png`,
  },
  {
    name: "TikTok",
    url: "https://www.tiktok.com/@smonk14",
    icon: `${ASSET_URL}/social/tiktok.png`,
  },
  {
    name: "Discord",
    url: "https://discord.gg/Kc86FT8XG",
    icon: `${ASSET_URL}/social/discordi.png`,
  },
];

export function createSocialLinks() {
  if (document.querySelector("#smonk-socials")) return;

  const container = document.createElement("div");
  container.id = "smonk-socials";

  container.innerHTML = `
    <span class="smonk-socials-title">SÍGUEME</span>

    <div class="smonk-socials-links">
      ${socialLinks
        .map(
          ({ name, url, icon }) => `
            <a
              href="${url}"
              target="_blank"
              rel="noopener noreferrer"
              class="smonk-social-link"
              aria-label="${name}"
            >
              <img
                src="${icon}"
                alt=""
                class="smonk-social-icon"
              />

              <span class="smonk-social-name">
                ${name}
              </span>
            </a>
          `
        )
        .join("")}
    </div>
  `;

  document.body.appendChild(container);
}