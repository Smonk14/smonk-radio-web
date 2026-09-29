import { onValue, ref, update } from "firebase/database";

import { database } from "../config/firebase";
import type { LiveConfig } from "../live/live.types";

import { createFavicon } from "../player/favicon";
import { createRadioStatus } from "./radioStatus";

import {
  isAdmin,
  listenAdminAuth,
  loginAdmin,
  logoutAdmin,
} from "./adminAuth";

import "./admin.css";


/* =========================================
   APP
========================================= */

const appElement =
  document.querySelector<HTMLDivElement>(
    "#admin-app"
  );

if (!appElement) {
  throw new Error(
    "No se encontró #admin-app"
  );
}

const app: HTMLDivElement = appElement;

/* =========================================
   FAVICON
========================================= */

createFavicon();


/* =========================================
   LOGIN
========================================= */

function renderLogin(): void {

  app.innerHTML = `
    <main class="admin-login">

      <section class="admin-login__card">

        <span class="admin__eyebrow">
          SMONK RADIO
        </span>

        <h1>
          Control Center
        </h1>

        <p>
          Inicia sesión para administrar la radio.
        </p>


        <form id="admin-login-form">

          <label class="admin__field">

            <span>
              Correo
            </span>

            <input
              id="admin-email"
              type="email"
              autocomplete="email"
              placeholder="correo@ejemplo.com"
              required
            />

          </label>


          <label class="admin__field">

            <span>
              Contraseña
            </span>

            <input
              id="admin-password"
              type="password"
              autocomplete="current-password"
              placeholder="••••••••••••"
              required
            />

          </label>


          <button
            id="admin-login-button"
            class="admin__save"
            type="submit"
          >
            INICIAR SESIÓN
          </button>


          <p
            id="admin-login-error"
            class="admin-login__error"
          ></p>

        </form>

      </section>

    </main>
  `;


  const form =
    document.querySelector<HTMLFormElement>(
      "#admin-login-form"
    )!;

  const email =
    document.querySelector<HTMLInputElement>(
      "#admin-email"
    )!;

  const password =
    document.querySelector<HTMLInputElement>(
      "#admin-password"
    )!;

  const error =
    document.querySelector<HTMLParagraphElement>(
      "#admin-login-error"
    )!;

  const loginButton =
    document.querySelector<HTMLButtonElement>(
      "#admin-login-button"
    )!;


  form.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();

      error.textContent = "";

      loginButton.disabled = true;

      loginButton.textContent =
        "INICIANDO SESIÓN...";


      try {

        await loginAdmin(
          email.value.trim(),
          password.value
        );

      } catch (loginError) {

        console.error(
          "Error login:",
          loginError
        );

        error.textContent =
          "Correo o contraseña incorrectos.";

        loginButton.disabled = false;

        loginButton.textContent =
          "INICIAR SESIÓN";

      }
    }
  );
}


/* =========================================
   DASHBOARD
========================================= */

function renderDashboard(): void {

  app.innerHTML = `

    <main class="admin">


      <!-- =========================
           HEADER
      ========================== -->

      <header class="admin__header">

        <div>

          <span class="admin__eyebrow">
            SMONK RADIO
          </span>

          <h1>
            Control Center
          </h1>

        </div>


        <div class="admin__header-actions">

          <div
            id="live-status"
            class="admin__status"
          >
            FUERA DEL AIRE
          </div>


          <button
            id="admin-logout"
            class="admin__logout"
            type="button"
          >
            CERRAR SESIÓN
          </button>

        </div>

      </header>


      <!-- =========================
           DASHBOARD
      ========================== -->

      <div class="admin__dashboard">


        <!-- =========================
             RADIO
        ========================== -->

        <section
          id="radio-status"
          class="admin__card radio-card"
        >

          <div class="radio-card__loading">

            Conectando con
            Smonk Radio...

          </div>

        </section>


        <!-- =========================
             CONTROL LIVE
        ========================== -->

        <section
          class="admin__card admin__live-card"
        >


          <div class="admin__live-control">


            <div>

              <span class="admin__label">
                Estado del programa
              </span>

              <strong
                id="live-state-text"
              >
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


          <div
            class="admin__divider"
          ></div>


          <!-- =========================
               FORMULARIO LIVE
          ========================== -->

          <form id="live-form">


            <label class="admin__field">

              <span>
                Título
              </span>

              <input
                id="live-title"
                type="text"
                maxlength="60"
                placeholder="SMONK RADIO LIVE"
              />

            </label>


            <label class="admin__field">

              <span>
                Comentarista
              </span>

              <input
                id="live-commentators"
                type="text"
                maxlength="60"
                placeholder="Smonk"
              />

            </label>


            <label class="admin__field">

              <span>
                Tipo de programa
              </span>

              <input
                id="live-type"
                type="text"
                maxlength="80"
                placeholder="Chisme + peticiones de música"
              />

            </label>


            <label class="admin__field">

              <span>
                Mensaje
              </span>

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


  /* =========================================
     RADIO STATUS
  ========================================= */

  createRadioStatus();


  /* =========================================
     LOGOUT
  ========================================= */

  const logoutButton =
    document.querySelector<HTMLButtonElement>(
      "#admin-logout"
    );


  logoutButton?.addEventListener(
    "click",
    async () => {

      try {

        await logoutAdmin();

      } catch (error) {

        console.error(
          "Error cerrando sesión:",
          error
        );

      }
    }
  );


  /* =========================================
     INICIAR CONTROL LIVE
  ========================================= */

  initializeLiveControls();
}


/* =========================================
   CONTROL LIVE
========================================= */

function initializeLiveControls(): void {

  const liveRef =
    ref(
      database,
      "liveConfig"
    );


  /* =========================================
     ELEMENTOS
  ========================================= */

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


  /* =========================================
     CONFIG ACTUAL
  ========================================= */

  let currentConfig:
    LiveConfig | null = null;


  /* =========================================
     FIREBASE LISTENER
  ========================================= */

  onValue(
    liveRef,
    (snapshot) => {

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

    }
  );


  /* =========================================
     ESTADO VISUAL
  ========================================= */

  function renderLiveState(
    active: boolean
  ): void {

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


  /* =========================================
     ACTIVAR / DESACTIVAR LIVE
  ========================================= */

  toggleButton.addEventListener(
    "click",
    async () => {

      if (!currentConfig) {
        return;
      }


      try {

        await update(
          liveRef,
          {

            active:
              !currentConfig.active,

            updatedAt:
              Date.now(),

          }
        );

      } catch (error) {

        console.error(
          "Error cambiando LIVE:",
          error
        );


        saveMessage.textContent =
          "No se pudo cambiar el estado.";

      }
    }
  );


  /* =========================================
     GUARDAR INFORMACIÓN LIVE
  ========================================= */

  form.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();


      try {

        await update(
          liveRef,
          {

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

          }
        );


        saveMessage.textContent =
          "✓ Cambios guardados";


        window.setTimeout(
          () => {

            saveMessage.textContent =
              "";

          },
          2500
        );

      } catch (error) {

        console.error(
          "Error guardando LIVE:",
          error
        );


        saveMessage.textContent =
          "No se pudieron guardar los cambios.";

      }
    }
  );
}


/* =========================================
   CONTROL DE AUTENTICACIÓN
========================================= */

listenAdminAuth(
  (user) => {

    if (!isAdmin(user)) {

      renderLogin();

      return;
    }


    renderDashboard();

  }
);