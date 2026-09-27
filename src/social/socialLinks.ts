const socialLinks = [
  {
    name: "YouTube",
    url: "https://www.youtube.com/@Smonk14",
    icon: "▶",
  },
  {
    name: "TikTok",
    url: "https://www.tiktok.com/@smonk14",
    icon: "♪",
  },
  {
    name: "Discord",
    url: "https://discord.gg/Kc86FT8XG",
    icon: "🎮",
  },
];

export function createSocialLinks() {
  if (document.querySelector("#smonk-socials")) return;

  const container = document.createElement("div");

  container.id = "smonk-socials";

  container.innerHTML = `
    <span class="smonk-socials-title">
      SÍGUEME
    </span>

    <div class="smonk-socials-links">
      ${socialLinks
        .map(
          (social) => `
            <a
              href="${social.url}"
              target="_blank"
              rel="noopener noreferrer"
              class="smonk-social-link"
              aria-label="${social.name}"
            >
              <span class="smonk-social-icon">
                ${social.icon}
              </span>

              <span class="smonk-social-name">
                ${social.name}
              </span>
            </a>
          `
        )
        .join("")}
    </div>
  `;

  document.body.appendChild(container);
}