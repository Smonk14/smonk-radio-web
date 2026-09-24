import { signInAnonymously } from "firebase/auth";

import { auth } from "../config/firebase";

import {
  getUserNickname,
  normalizeNickname,
  reserveNickname,
} from "./nickname";

import {
  listenToMessages,
  sendMessage,
  type ChatMessage,
} from "./messages";

export async function createChat() {
  try {
    /* Evitar chat duplicado */
    if (document.querySelector("#smonk-chat")) {
      return;
    }

    /* =========================
       AUTENTICACIÓN
    ========================= */

    const credential =
      await signInAnonymously(auth);

    const user = credential.user;

    /* =========================
       CREAR CHAT
    ========================= */

    const chat = document.createElement("div");

    chat.id = "smonk-chat";

    chat.innerHTML = `
      <div class="smonk-chat-header">

        <div>
          <span class="smonk-chat-dot"></span>
          <strong>CHAT SMONK RADIO</strong>
        </div>

        <button
          id="smonk-change-name"
          type="button"
          title="Cambiar sobrenombre"
          aria-label="Cambiar sobrenombre"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 20H21"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />

            <path
              d="M16.5 3.5C17.3284 2.67157 18.6716 2.67157 19.5 3.5C20.3284 4.32843 20.3284 5.67157 19.5 6.5L8 18L4 19L5 15L16.5 3.5Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

      </div>

      <div id="smonk-chat-login">

        <div class="smonk-chat-welcome">
          <strong>¡PE PE PEROOO!</strong>

          <span>
            Elige un sobrenombre para entrar al chat.
          </span>
        </div>

        <input
          id="smonk-nickname"
          type="text"
          maxlength="20"
          autocomplete="off"
          placeholder="Tu sobrenombre"
        />

        <button
          id="smonk-enter-chat"
          type="button"
        >
          ENTRAR AL CHAT
        </button>

        <button
          id="smonk-back-chat"
          type="button"
          hidden
        >
          ← VOLVER AL CHAT
        </button>

        <div id="smonk-login-error"></div>

      </div>

      <div
        id="smonk-chat-room"
        hidden
      >

        <div id="smonk-messages"></div>

        <form id="smonk-chat-form">

          <input
            id="smonk-message-input"
            type="text"
            maxlength="250"
            autocomplete="off"
            placeholder="Escribe un mensaje..."
          />

          <button
            type="submit"
            title="Enviar mensaje"
          >
            ➤
          </button>

        </form>

      </div>
    `;

    document.body.appendChild(chat);

    /* =========================
       ELEMENTOS
    ========================= */

    const login =
      chat.querySelector<HTMLElement>(
        "#smonk-chat-login"
      )!;

    const room =
      chat.querySelector<HTMLElement>(
        "#smonk-chat-room"
      )!;

    const nicknameInput =
      chat.querySelector<HTMLInputElement>(
        "#smonk-nickname"
      )!;

    const enterButton =
      chat.querySelector<HTMLButtonElement>(
        "#smonk-enter-chat"
      )!;

    const backChatButton =
      chat.querySelector<HTMLButtonElement>(
        "#smonk-back-chat"
      )!;

    const changeNameButton =
      chat.querySelector<HTMLButtonElement>(
        "#smonk-change-name"
      )!;

    const loginError =
      chat.querySelector<HTMLElement>(
        "#smonk-login-error"
      )!;

    const messagesContainer =
      chat.querySelector<HTMLElement>(
        "#smonk-messages"
      )!;

    const form =
      chat.querySelector<HTMLFormElement>(
        "#smonk-chat-form"
      )!;

    const messageInput =
      chat.querySelector<HTMLInputElement>(
        "#smonk-message-input"
      )!;

    /* =========================
       ESTADO
    ========================= */

    let nickname = "";
    let nicknameKey = "";

    /* =========================
       ABRIR CHAT
    ========================= */

    function openChat() {
      login.hidden = true;
      room.hidden = false;

      // Ahora usamos flex porque contiene el SVG.
      changeNameButton.style.display = "flex";

      messageInput.focus();
    }

    /* =========================
       ABRIR NICKNAME
    ========================= */

    function openNickname() {
      login.hidden = false;
      room.hidden = true;

      changeNameButton.style.display = "none";

      nicknameInput.value = nickname;

      // Solo se puede volver si ya existe
      // un nickname registrado.
      backChatButton.hidden = !nickname;

      nicknameInput.focus();
    }

    /* =========================
       CARGAR NICKNAME
    ========================= */

    async function loadCurrentNickname() {
      try {
        const currentNickname =
          await getUserNickname(user.uid);

        if (currentNickname) {
          nickname = currentNickname;

          nicknameKey =
            normalizeNickname(currentNickname);

          localStorage.setItem(
            "smonkNickname",
            nickname
          );

          openChat();

          return;
        }

        localStorage.removeItem(
          "smonkNickname"
        );

        openNickname();
      } catch (error) {
        console.error(
          "❌ Error consultando nickname:",
          error
        );

        openNickname();
      }
    }

    /* =========================
       REGISTRAR NICKNAME
    ========================= */

    enterButton.addEventListener(
      "click",
      async () => {
        const value =
          nicknameInput.value.trim();

        loginError.textContent = "";

        if (value.length < 2) {
          loginError.textContent =
            "El sobrenombre debe tener mínimo 2 caracteres.";

          return;
        }

        enterButton.disabled = true;
        enterButton.textContent =
          "ENTRANDO...";

        try {
          const result =
            await reserveNickname({
              uid: user.uid,
              value,
              currentNicknameKey:
                nicknameKey,
            });

          nickname = result.nickname;
          nicknameKey =
            result.nicknameKey;

          localStorage.setItem(
            "smonkNickname",
            nickname
          );

          loginError.textContent = "";

          openChat();
        } catch (error) {
          console.error(
            "❌ Error registrando nickname:",
            error
          );

          loginError.textContent =
            error instanceof Error
              ? error.message
              : "No se pudo registrar el sobrenombre.";
        } finally {
          enterButton.disabled = false;

          enterButton.textContent =
            "ENTRAR AL CHAT";
        }
      }
    );

    /* =========================
       ENTER EN NICKNAME
    ========================= */

    nicknameInput.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          enterButton.click();
        }
      }
    );

    /* =========================
       EDITAR NICKNAME
    ========================= */

    changeNameButton.addEventListener(
      "click",
      () => {
        loginError.textContent = "";
        openNickname();
      }
    );

    /* =========================
       CANCELAR EDICIÓN
    ========================= */

    backChatButton.addEventListener(
      "click",
      () => {
        loginError.textContent = "";

        nicknameInput.value =
          nickname;

        openChat();
      }
    );

    /* =========================
       MOSTRAR MENSAJE
    ========================= */

    function renderMessage(
      data: ChatMessage
    ) {
      const message =
        document.createElement("div");

      message.className =
        data.uid === user.uid
          ? "smonk-message smonk-message-me"
          : "smonk-message";

      const name =
        document.createElement("div");

      name.className =
        "smonk-message-name";

      name.textContent =
        data.nickname;

      const text =
        document.createElement("div");

      text.className =
        "smonk-message-text";

      // Importante: textContent evita
      // insertar HTML/JS en el chat.
      text.textContent =
        data.message;

      const time =
        document.createElement("div");

      time.className =
        "smonk-message-time";

      if (
        typeof data.timestamp === "number"
      ) {
        time.textContent =
          new Date(
            data.timestamp
          ).toLocaleTimeString(
            [],
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          );
      }

      message.appendChild(name);
      message.appendChild(text);
      message.appendChild(time);

      messagesContainer.appendChild(
        message
      );

      messagesContainer.scrollTop =
        messagesContainer.scrollHeight;
    }

    /* =========================
       ESCUCHAR FIREBASE
    ========================= */

    listenToMessages(renderMessage);

    /* =========================
       ENVIAR MENSAJE
    ========================= */

    form.addEventListener(
      "submit",
      async (event) => {
        event.preventDefault();

        const text =
          messageInput.value.trim();

        if (!text || !nickname) {
          return;
        }

        const cleanMessage =
          text.substring(0, 250);

        messageInput.value = "";

        try {
          await sendMessage(
            user.uid,
            nickname,
            cleanMessage
          );
        } catch (error) {
          console.error(
            "❌ No se pudo enviar el mensaje:",
            error
          );

          // Restauramos el mensaje si Firebase falla.
          messageInput.value =
            cleanMessage;
        }
      }
    );

    /* =========================
       INICIAR
    ========================= */

    await loadCurrentNickname();

  } catch (error) {
    console.error(
      "❌ Error iniciando Smonk Chat:",
      error
    );
  }
}