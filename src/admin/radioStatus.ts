const NOW_PLAYING_URL =
  "https://smonkradio.top/api/nowplaying/smonk";

interface NowPlayingResponse {
  is_online: boolean;

  listeners: {
    current: number;
    unique: number;
    total: number;
  };

  now_playing: {
    elapsed: number;
    duration: number;

    song: {
      title: string;
      artist: string;
      art: string;
    };
  };
}

function formatTime(seconds: number): string {
  if (!seconds || seconds < 0) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

export function createRadioStatus(): void {
  const element =
    document.querySelector<HTMLDivElement>(
      "#radio-status"
    );

  if (!element) {
    throw new Error("No se encontró #radio-status");
  }

  const container = element;

  async function loadNowPlaying() {
    try {
      const response = await fetch(NOW_PLAYING_URL, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(
          `AzuraCast respondió ${response.status}`
        );
      }

      const data =
        (await response.json()) as NowPlayingResponse;

      const title =
        data.now_playing?.song?.title ||
        "Sin información";

      const artist =
        data.now_playing?.song?.artist ||
        "Artista desconocido";

      const art =
        data.now_playing?.song?.art || "";

      const listeners =
        data.listeners?.current ?? 0;

      const elapsed =
        data.now_playing?.elapsed ?? 0;

      const duration =
        data.now_playing?.duration ?? 0;

      const progress =
        duration > 0
          ? Math.min(
              100,
              Math.max(
                0,
                (elapsed / duration) * 100
              )
            )
          : 0;

      container.innerHTML = `
        <div class="radio-card__header">
          <div>
            <span class="admin__label">
              RADIO AHORA
            </span>

            <strong class="radio-card__status">
              ${
                data.is_online
                  ? "● ONLINE"
                  : "● OFFLINE"
              }
            </strong>
          </div>

          <div class="radio-card__listeners">
            👥
            <strong>${listeners}</strong>
            <span>
              ${listeners === 1 ? "oyente" : "oyentes"}
            </span>
          </div>
        </div>

        <div class="radio-card__song">

          ${
            art
              ? `
                <img
                  class="radio-card__cover"
                  src="${art}"
                  alt=""
                />
              `
              : `
                <div class="radio-card__cover radio-card__cover--empty">
                  ♪
                </div>
              `
          }

          <div class="radio-card__info">
            <span class="admin__label">
              SONANDO AHORA
            </span>

            <strong class="radio-card__title">
              ${escapeHtml(title)}
            </strong>

            <span class="radio-card__artist">
              ${escapeHtml(artist)}
            </span>

            <div class="radio-card__progress">
              <div
                class="radio-card__progress-bar"
                style="width: ${progress}%"
              ></div>
            </div>

            <div class="radio-card__time">
              <span>${formatTime(elapsed)}</span>
              <span>${formatTime(duration)}</span>
            </div>
          </div>

        </div>

        <button
          id="skip-song"
          class="radio-card__skip"
          type="button"
        >
          ⏭ PASAR CANCIÓN
        </button>
      `;

      const skipButton =
        container.querySelector<HTMLButtonElement>(
          "#skip-song"
        );

      skipButton?.addEventListener("click", async () => {
        if (!skipButton) return;

        const confirmed = window.confirm(
          `¿Quieres pasar "${title}" de ${artist}?`
        );

        if (!confirmed) return;

        try {
          skipButton.disabled = true;
          skipButton.textContent = "⏳ PASANDO CANCIÓN...";

          const response = await fetch("/api/skip-song", {
            method: "POST",
          });

          if (!response.ok) {
            const error = await response.json().catch(() => null);

            console.error("Error skip:", error);

            throw new Error(
              error?.error ?? "No se pudo pasar la canción"
            );
          }

          skipButton.textContent = "✓ CANCIÓN PASADA";

          /*
          * Le damos un momento a AzuraCast
          * para cambiar la canción.
          */
          window.setTimeout(() => {
            void loadNowPlaying();
          }, 1500);

        } catch (error) {
          console.error("Error pasando canción:", error);

          skipButton.textContent = "⚠ ERROR AL PASAR";

          window.setTimeout(() => {
            skipButton.disabled = false;
            skipButton.textContent = "⏭ PASAR CANCIÓN";
          }, 2000);
        }
      });
    } catch (error) {
      console.error(
        "Error cargando AzuraCast:",
        error
      );

      container.innerHTML = `
        <div class="radio-card__error">
          No se pudo conectar con AzuraCast.
        </div>
      `;
    }
  }

  
  void loadNowPlaying();

  window.setInterval(() => {
    void loadNowPlaying();
  }, 10000);
}

function escapeHtml(value: string): string {
  const element = document.createElement("div");

  element.textContent = value;

  return element.innerHTML;
}