import { onValue, ref, update } from "firebase/database";

import { database } from "../config/firebase";
import type { LiveConfig } from "../live/live.types";

import { createRadioStatus } from "./radioStatus";
import { createFaviconAdmin } from "../player/faviconAdmin";

import "./admin.css";

const app =
  document.querySelector<HTMLDivElement>("#admin-app");

if (!app) {
  throw new Error("No se encontró #admin-app");
}

/* =========================
   HTML
   ========================= */

app.innerHTML = `
  <main class="admin">

    <header class="admin__header">
      <div>
        <span class="admin__eyebrow">
          SMONK RADIO
        </span>

        <h1>Control Center</h1>
      </div>

      <div
        id="live-status"
        class="admin__status"
      >
        FUERA DEL AIRE
      </div>
    </header>


    <!-- =========================
         DASHBOARD
         ========================= -->

    <div class="admin__dashboard">


      <!-- =========================
           RADIO / NOW PLAYING
           ========================= -->

      <section
        id="radio-status"
        class="admin__card radio-card"
      >
        <div class="radio-card__loading">
          Conectando con Smonk Radio...
        </div>
      </section>


      <!-- =========================
           CONTROL LIVE
           ========================= -->

      <section class="admin__card admin__live-card">

        <div class="admin__live-control">

          <div>
            <span class="admin__label">
              Estado del programa
            </span>

            <strong id="live-state-text">
              Fuera del aire
            </strong>
          </div>

          <button
            id="toggle-live"
            class="admin__live-button"
            type="button"
          >
            ACTIVAR LIVE
          </button>

        </div>


        <div class="admin__divider"></div>


        <!-- =========================
             FORMULARIO LIVE
             ========================= -->

        <form id="live-form">

          <label class="admin__field">
            <span>Título</span>

            <input
              id="live-title"
              type="text"
              maxlength="60"
              placeholder="SMONK RADIO LIVE"
            />
          </label>


          <label class="admin__field">
            <span>Comentarista</span>

            <input
              id="live-commentators"
              type="text"
              maxlength="60"
              placeholder="Smonk"
            />
          </label>


          <label class="admin__field">
            <span>Tipo de programa</span>

            <input
              id="live-type"
              type="text"
              maxlength="80"
              placeholder="Chisme + peticiones de música"
            />
          </label>


          <label class="admin__field">
            <span>Mensaje</span>

            <textarea
              id="live-message"
              maxlength="180"
              rows="3"
              placeholder="Pide tu canción en el chat 🔥"
            ></textarea>
          </label>


          <button
            class="admin__save"
            type="submit"
          >
            GUARDAR CAMBIOS
          </button>


          <p
            id="save-message"
            class="admin__save-message"
          ></p>

        </form>

      </section>

    </div>

  </main>
`;


/* =========================
   INICIAR RADIO STATUS
   ========================= */

createRadioStatus();

/* =========================
   INICIAR ADMIN
   ========================= */

createFaviconAdmin();
createRadioStatus();


/* =========================
   FIREBASE
   ========================= */

const liveRef =
  ref(database, "liveConfig");


/* =========================
   ELEMENTOS DEL FORMULARIO
   ========================= */

const titleInput =
  document.querySelector<HTMLInputElement>(
    "#live-title"
  )!;

const commentatorsInput =
  document.querySelector<HTMLInputElement>(
    "#live-commentators"
  )!;

const typeInput =
  document.querySelector<HTMLInputElement>(
    "#live-type"
  )!;

const messageInput =
  document.querySelector<HTMLTextAreaElement>(
    "#live-message"
  )!;

const toggleButton =
  document.querySelector<HTMLButtonElement>(
    "#toggle-live"
  )!;

const liveStatus =
  document.querySelector<HTMLDivElement>(
    "#live-status"
  )!;

const liveStateText =
  document.querySelector<HTMLElement>(
    "#live-state-text"
  )!;

const form =
  document.querySelector<HTMLFormElement>(
    "#live-form"
  )!;

const saveMessage =
  document.querySelector<HTMLParagraphElement>(
    "#save-message"
  )!;


/* =========================
   ESTADO ACTUAL
   ========================= */

let currentConfig: LiveConfig | null = null;


/* =========================
   FIREBASE LISTENER
   ========================= */

onValue(liveRef, (snapshot) => {

  if (!snapshot.exists()) {
    return;
  }

  currentConfig =
    snapshot.val() as LiveConfig;

  titleInput.value =
    currentConfig.title ?? "";

  commentatorsInput.value =
    currentConfig.commentators ?? "";

  typeInput.value =
    currentConfig.type ?? "";

  messageInput.value =
    currentConfig.message ?? "";

  renderLiveState(
    currentConfig.active
  );
});


/* =========================
   ESTADO VISUAL LIVE
   ========================= */

function renderLiveState(
  active: boolean
) {

  if (active) {

    liveStatus.textContent =
      "● EN VIVO";

    liveStatus.classList.add(
      "admin__status--live"
    );

    liveStateText.textContent =
      "Transmitiendo";

    toggleButton.textContent =
      "FINALIZAR LIVE";

    toggleButton.classList.add(
      "admin__live-button--stop"
    );

    return;
  }


  liveStatus.textContent =
    "FUERA DEL AIRE";

  liveStatus.classList.remove(
    "admin__status--live"
  );

  liveStateText.textContent =
    "Fuera del aire";

  toggleButton.textContent =
    "ACTIVAR LIVE";

  toggleButton.classList.remove(
    "admin__live-button--stop"
  );
}


/* =========================
   ACTIVAR / DESACTIVAR LIVE
   ========================= */

toggleButton.addEventListener(
  "click",
  async () => {

    if (!currentConfig) {
      return;
    }

    try {

      await update(liveRef, {

        active:
          !currentConfig.active,

        updatedAt:
          Date.now(),

      });

    } catch (error) {

      console.error(error);

      saveMessage.textContent =
        "No se pudo cambiar el estado.";

    }
  }
);


/* =========================
   GUARDAR INFORMACIÓN LIVE
   ========================= */

form.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();

    try {

      await update(liveRef, {

        title:
          titleInput.value.trim(),

        commentators:
          commentatorsInput.value.trim(),

        type:
          typeInput.value.trim(),

        message:
          messageInput.value.trim(),

        updatedAt:
          Date.now(),

      });


      saveMessage.textContent =
        "✓ Cambios guardados";


      window.setTimeout(() => {

        saveMessage.textContent = "";

      }, 2500);

    } catch (error) {

      console.error(error);

      saveMessage.textContent =
        "No se pudieron guardar los cambios.";

    }
  }
);