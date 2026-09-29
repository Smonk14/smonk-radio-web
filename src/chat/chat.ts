import type { User } from "firebase/auth";

import {
  loginAsGuest,
  loginWithGoogle,
  waitForAuth,
} from "./chatAuth";

import {
  getUserNickname,
  normalizeNickname,
  reserveNickname,
} from "./nickname";

import {
  listenToMessages,
  sendEmote,
  sendGif,
  sendMessage,
  type ChatMessage,
} from "./messages";

import {
  CHAT_COLORS,
  CHAT_ICONS,
  DEFAULT_CHAT_PROFILE,
  getChatColor,
  getChatIcon,
  getChatProfile,
  saveChatProfile,
  type ChatProfile,
} from "./profile";

import {
  CHAT_EMOTES,
  CHAT_GIFS,
  getChatEmote,
  getChatGif,
} from "./emotes";

export async function createChat() {
  try {
    /* =========================================
       EVITAR CHAT DUPLICADO
    ========================================= */

    if (document.querySelector("#smonk-chat")) {
      return;
    }


    /* =========================================
       CREAR CHAT
    ========================================= */

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
          style="display: none;"
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


      <!-- ==============================
           SELECCIÓN DE AUTENTICACIÓN
      =============================== -->

      <div id="smonk-chat-auth">

        <div class="smonk-chat-welcome">

          <strong>¡PE PE PEROOO!</strong>

          <span>
            Únete al chat de Smonk Radio
          </span>

        </div>


        <button
          id="smonk-google-login"
          class="smonk-auth-button smonk-auth-google"
          type="button"
        >
          <span class="smonk-google-icon">G</span>
          CONTINUAR CON GOOGLE
        </button>


        <div class="smonk-auth-divider">
          <span>o</span>
        </div>


        <button
          id="smonk-guest-login"
          class="smonk-auth-button smonk-auth-guest"
          type="button"
        >
          ENTRAR COMO INVITADO
        </button>


        <div
          id="smonk-auth-error"
          class="smonk-auth-error"
        ></div>

      </div>


      <!-- ==============================
           NICKNAME / PERFIL
      =============================== -->

      <div
        id="smonk-chat-login"
        hidden
      >

        <div class="smonk-chat-welcome">

          <strong>PONTE UN NOMBRE!</strong>

          <span>
            Elige tu sobrenombre para entrar al chat.
          </span>

        </div>


        <input
          id="smonk-nickname"
          type="text"
          maxlength="20"
          autocomplete="off"
          placeholder="Tu sobrenombre"
        />


        <div class="smonk-profile-section">

          <span class="smonk-profile-label">
            COLOR DEL NOMBRE
          </span>

          <div
            id="smonk-color-picker"
            class="smonk-color-picker"
          ></div>

        </div>


        <div class="smonk-profile-section">

          <span class="smonk-profile-label">
            TU ICONO
          </span>

          <div class="smonk-icon-category">
            <span class="smonk-icon-category-title">
              BALONES
            </span>

            <div
              id="smonk-ball-picker"
              class="smonk-icon-picker"
            ></div>
          </div>

          <div class="smonk-icon-category">
            <span class="smonk-icon-category-title">
              CARROS
            </span>

            <div
              id="smonk-car-picker"
              class="smonk-icon-picker"
            ></div>
          </div>

        </div>


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


      <!-- ==============================
           CHAT
      =============================== -->

      <div
        id="smonk-chat-room"
        hidden
      >

        <div id="smonk-messages"></div>

        <div
          id="smonk-emote-panel"
          class="smonk-emote-panel"
          hidden
        >
          <div class="smonk-emote-tabs">

            <button
              id="smonk-emote-tab"
              class="smonk-emote-tab active"
              type="button"
            >
              EMOTES
            </button>

            <button
              id="smonk-gif-tab"
              class="smonk-emote-tab"
              type="button"
            >
              GIFS
            </button>

          </div>

          <div
            id="smonk-emote-grid"
            class="smonk-emote-grid"
          ></div>
        </div>

        <form id="smonk-chat-form">

    <input
      id="smonk-message-input"
      type="text"
      maxlength="250"
      autocomplete="off"
      placeholder="Escribe un mensaje..."
    />

    <button
      id="smonk-emote-button"
      type="button"
      title="Emotes y GIFs"
      aria-label="Emotes y GIFs"
    >
      <img
        src="https://smonk-radio-web.vercel.app/chat/emotes/dinolove.png"
        alt=""
        class="smonk-emote-button-icon"
      />
    </button>

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


    /* =========================================
       ELEMENTOS
    ========================================= */

    const colorPicker =
      chat.querySelector<HTMLElement>(
        "#smonk-color-picker"
      )!;


    const ballPicker =
      chat.querySelector<HTMLElement>(
        "#smonk-ball-picker"
      )!;

    const carPicker =
      chat.querySelector<HTMLElement>(
        "#smonk-car-picker"
      )!;


    const authScreen =
      chat.querySelector<HTMLElement>(
        "#smonk-chat-auth"
      )!;


    const nicknameScreen =
      chat.querySelector<HTMLElement>(
        "#smonk-chat-login"
      )!;


    const room =
      chat.querySelector<HTMLElement>(
        "#smonk-chat-room"
      )!;


    const googleButton =
      chat.querySelector<HTMLButtonElement>(
        "#smonk-google-login"
      )!;


    const guestButton =
      chat.querySelector<HTMLButtonElement>(
        "#smonk-guest-login"
      )!;


    const authError =
      chat.querySelector<HTMLElement>(
        "#smonk-auth-error"
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

    const emoteButton =
      chat.querySelector<HTMLButtonElement>(
        "#smonk-emote-button"
      )!;

    const emotePanel =
      chat.querySelector<HTMLElement>(
        "#smonk-emote-panel"
      )!;

    const emoteGrid =
      chat.querySelector<HTMLElement>(
        "#smonk-emote-grid"
      )!;

    const emoteTab =
      chat.querySelector<HTMLButtonElement>(
        "#smonk-emote-tab"
      )!;

    const gifTab =
      chat.querySelector<HTMLButtonElement>(
        "#smonk-gif-tab"
      )!;

    /* =========================================
       ESTADO
    ========================================= */

    let user: User | null = null;

    let nickname = "";

    let nicknameKey = "";

    let profile: ChatProfile = {
      ...DEFAULT_CHAT_PROFILE,
    };

    let messagesStarted = false;


    /* =========================================
       PERFIL
    ========================================= */

function renderProfileSelectors() {
  colorPicker.innerHTML = "";
  ballPicker.innerHTML = "";
  carPicker.innerHTML = "";

  /* =========================================
     COLORES
  ========================================= */

  CHAT_COLORS.forEach((color) => {
    const button =
      document.createElement("button");

    button.type = "button";

    button.className =
      "smonk-color-option";

    if (profile.color === color.id) {
      button.classList.add(
        "selected"
      );
    }

    button.style.backgroundColor =
      color.value;

    button.title = color.id;

    button.setAttribute(
      "aria-label",
      `Color ${color.id}`
    );

    button.addEventListener(
      "click",
      () => {
        profile.color =
          color.id;

        renderProfileSelectors();
      }
    );

    colorPicker.appendChild(
      button
    );
  });


  /* =========================================
     ICONOS
  ========================================= */

  CHAT_ICONS.forEach((icon) => {
    const button =
      document.createElement("button");

    button.type = "button";

    button.className =
      "smonk-icon-option";

    if (profile.icon === icon.id) {
      button.classList.add(
        "selected"
      );
    }

    button.title = icon.label;

    button.setAttribute(
      "aria-label",
      `Icono ${icon.label}`
    );


    /* IMAGEN */

    const image =
      document.createElement("img");

    image.src = icon.src;

    image.alt = icon.label;

    image.loading = "lazy";

    image.draggable = false;

    button.appendChild(image);


    /* SELECCIONAR */

    button.addEventListener(
      "click",
      () => {
        profile.icon =
          icon.id;

        renderProfileSelectors();
      }
    );


    /* CATEGORÍA */

    if (icon.category === "ball") {
      ballPicker.appendChild(
        button
      );
    } else {
      carPicker.appendChild(
        button
      );
    }
  });
}


    /* =========================================
       PANTALLAS
    ========================================= */

    function hideAllScreens() {
      authScreen.hidden = true;

      nicknameScreen.hidden = true;

      room.hidden = true;
    }


    function openAuth() {
      hideAllScreens();

      authScreen.hidden = false;

      changeNameButton.style.display =
        "none";
    }


    function openChat() {
      hideAllScreens();

      room.hidden = false;

      changeNameButton.style.display =
        "flex";

      messageInput.focus();

      startMessages();
    }


    function openNickname() {
      hideAllScreens();

      renderProfileSelectors();

      nicknameScreen.hidden = false;

      changeNameButton.style.display =
        "none";

      nicknameInput.value =
        nickname;

      backChatButton.hidden =
        !nickname;

      enterButton.textContent =
        nickname
          ? "GUARDAR CAMBIOS"
          : "ENTRAR AL CHAT";

      nicknameInput.focus();
    }


    /* =========================================
       MENSAJES
    ========================================= */

    function renderMessage(
      data: ChatMessage
    ) {
      const message =
        document.createElement("div");


      message.className =
        data.uid === user?.uid
          ? "smonk-message smonk-message-me"
          : "smonk-message";


    /* =========================================
      NOMBRE + ICONO + COLOR
    ========================================= */

    const name =
      document.createElement("div");

    name.className =
      "smonk-message-name";


    const icon =
      getChatIcon(
        data.icon ?? "ball_blue"
      );

    const iconElement =
      document.createElement("img");

    iconElement.className =
      "smonk-message-icon";

    iconElement.src =
      icon.src;

    iconElement.alt =
      icon.label;

    iconElement.title =
      icon.label;

    iconElement.loading =
      "lazy";

    iconElement.draggable =
      false;


    const nicknameElement =
      document.createElement("span");

    nicknameElement.className =
      "smonk-message-nickname";

    nicknameElement.textContent =
      data.nickname;

    nicknameElement.style.color =
      getChatColor(
        data.color ?? "red"
      );


    name.appendChild(
      iconElement
    );

    name.appendChild(
      nicknameElement
    );

    /* =========================================
       TEXTO
    ========================================= */

    const text =
      document.createElement("div");

    text.className =
      "smonk-message-text";


    /* =========================================
      CONTENIDO DEL MENSAJE
    ========================================= */

    const messageType =
      data.type ?? "text";


    if (messageType === "emote") {
      const emote =
        getChatEmote(data.message);

      if (emote) {
        const image =
          document.createElement("img");

        image.className =
          "smonk-chat-emote";

        image.src =
          emote.src;

        image.alt =
          data.message;

        image.title =
          data.message;

        image.loading =
          "lazy";

        image.draggable =
          false;

        text.appendChild(image);
      } else {
        text.textContent =
          data.message;
      }

    } else if (messageType === "gif") {
      const gif =
        getChatGif(data.message);

      if (gif) {
        const image =
          document.createElement("img");

        image.className =
          "smonk-chat-gif";

        image.src =
          gif.src;

        image.alt =
          data.message;

        image.title =
          data.message;

        image.loading =
          "lazy";

        image.draggable =
          false;

        text.appendChild(image);
      } else {
        text.textContent =
          data.message;
      }

    } else {
      // Mensaje normal.
      // textContent evita inyección HTML/JS.
      text.textContent =
        data.message;
    }

      /* =========================================
         HORA
      ========================================= */

      const time =
        document.createElement("div");

      time.className =
        "smonk-message-time";


      if (
        typeof data.timestamp ===
        "number"
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


      /* =========================================
         ARMAR MENSAJE
      ========================================= */

      message.appendChild(name);

      message.appendChild(text);

      message.appendChild(time);


      messagesContainer.appendChild(
        message
      );


      messagesContainer.scrollTop =
        messagesContainer.scrollHeight;
    }


    function startMessages() {
      if (messagesStarted) {
        return;
      }


      messagesStarted = true;

      listenToMessages(
        renderMessage
      );
    }


    /* =========================================
       USUARIO AUTENTICADO
    ========================================= */

    async function loadUser(
      authenticatedUser: User
    ) {
      user = authenticatedUser;


      profile =
        await getChatProfile(
          authenticatedUser.uid
        );


      authError.textContent = "";


      try {
        const currentNickname =
          await getUserNickname(
            authenticatedUser.uid
          );


        if (currentNickname) {
          nickname =
            currentNickname;


          nicknameKey =
            normalizeNickname(
              currentNickname
            );


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


    /* =========================================
       GOOGLE
    ========================================= */

    googleButton.addEventListener(
      "click",
      async () => {
        authError.textContent = "";


        // Solo bloqueamos Google.
        // Invitado sigue disponible.
        googleButton.disabled = true;


        googleButton.innerHTML = `
          <span class="smonk-google-icon">
            G
          </span>
          CONECTANDO...
        `;


        try {
          const googleUser =
            await loginWithGoogle();


          await loadUser(
            googleUser
          );

        } catch (error) {
          const firebaseError =
            error as {
              code?: string;
            };


          console.error(
            "❌ Error iniciando con Google:",
            firebaseError
          );


          if (
            firebaseError.code ===
              "auth/popup-closed-by-user" ||
            firebaseError.code ===
              "auth/cancelled-popup-request"
          ) {
            authError.textContent =
              "Inicio con Google cancelado.";
          } else {
            authError.textContent =
              "No se pudo iniciar sesión con Google.";
          }

        } finally {
          googleButton.disabled =
            false;


          googleButton.innerHTML = `
            <span class="smonk-google-icon">
              G
            </span>
            CONTINUAR CON GOOGLE
          `;
        }
      }
    );


    /* =========================================
       INVITADO
    ========================================= */

    guestButton.addEventListener(
      "click",
      async () => {
        authError.textContent = "";

        guestButton.disabled =
          true;

        guestButton.textContent =
          "ENTRANDO...";


        try {
          let guestUser = user;

          if (
            !guestUser ||
            !guestUser.isAnonymous
          ) {
            guestUser =
              await loginAsGuest();
          }

          await loadUser(guestUser);

        } catch (error) {
          console.error(
            "❌ Error entrando como invitado:",
            error
          );


          authError.textContent =
            "No se pudo entrar como invitado.";

        } finally {
          guestButton.disabled =
            false;

          guestButton.textContent =
            "ENTRAR COMO INVITADO";
        }
      }
    );


    /* =========================================
       REGISTRAR / CAMBIAR NICKNAME
    ========================================= */

    enterButton.addEventListener(
      "click",
      async () => {
        if (!user) {
          openAuth();

          return;
        }


        const value =
          nicknameInput.value.trim();


        loginError.textContent =
          "";


        if (value.length < 2) {
          loginError.textContent =
            "El sobrenombre debe tener mínimo 2 caracteres.";

          return;
        }


        enterButton.disabled =
          true;

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


          await saveChatProfile(
            user.uid,
            profile
          );


          nickname =
            result.nickname;

          nicknameKey =
            result.nicknameKey;


          localStorage.setItem(
            "smonkNickname",
            nickname
          );


          loginError.textContent =
            "";


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
          enterButton.disabled =
            false;

          enterButton.textContent =
            nickname
              ? "GUARDAR CAMBIOS"
              : "ENTRAR AL CHAT";
                  }
      }
    );


    /* =========================================
       ENTER EN NICKNAME
    ========================================= */

    nicknameInput.addEventListener(
      "keydown",
      (event) => {
        if (
          event.key === "Enter"
        ) {
          event.preventDefault();

          enterButton.click();
        }
      }
    );


    /* =========================================
       EDITAR PERFIL / NICKNAME
    ========================================= */

    changeNameButton.addEventListener(
      "click",
      () => {
        loginError.textContent =
          "";

        openNickname();
      }
    );


    /* =========================================
       CANCELAR EDICIÓN
    ========================================= */
    backChatButton.addEventListener(
      "click",
      async () => {
        loginError.textContent = "";

        nicknameInput.value =
          nickname;

        if (user) {
          profile =
            await getChatProfile(
              user.uid
            );
        }

        openChat();
      }
    );

    /* =========================================
    EMOTES / GIFS
    ========================================= */

    type MediaTab =
      | "emotes"
      | "gifs";

    let activeMediaTab: MediaTab =
      "emotes";


    function renderMediaPicker() {
      emoteGrid.innerHTML = "";

      const items =
        activeMediaTab === "emotes"
          ? CHAT_EMOTES
          : CHAT_GIFS;

      items.forEach((item) => {
        const button =
          document.createElement("button");

        button.type = "button";

        button.className =
          "smonk-emote-option";

        button.title =
          item.id;


        const image =
          document.createElement("img");

        image.src =
          item.src;

        image.alt =
          item.id;

        image.loading =
          "lazy";

        image.draggable =
          false;


        button.appendChild(image);

        button.addEventListener(
          "click",
          async () => {
            if (!user || !nickname) {
              return;
            }

            button.disabled = true;

            try {
              if (activeMediaTab === "emotes") {
                await sendEmote({
                  uid: user.uid,
                  nickname,
                  emoteId: item.id,
                  color: profile.color,
                  icon: profile.icon,
                });
              } else {
                await sendGif({
                  uid: user.uid,
                  nickname,
                  gifId: item.id,
                  color: profile.color,
                  icon: profile.icon,
                });
              }

              emotePanel.hidden = true;

            } catch (error) {
              console.error(
                "❌ No se pudo enviar el emote/GIF:",
                error
              );
            } finally {
              button.disabled = false;
            }
          }
        );

        emoteGrid.appendChild(
          button
        );
      });
    }


    function selectMediaTab(
      tab: MediaTab
    ) {
      activeMediaTab = tab;

      emoteTab.classList.toggle(
        "active",
        tab === "emotes"
      );

      gifTab.classList.toggle(
        "active",
        tab === "gifs"
      );

      renderMediaPicker();
    }


    emoteButton.addEventListener(
      "click",
      () => {
        emotePanel.hidden =
          !emotePanel.hidden;

        if (!emotePanel.hidden) {
          renderMediaPicker();
        }
      }
    );


    emoteTab.addEventListener(
      "click",
      () => {
        selectMediaTab("emotes");
      }
    );


    gifTab.addEventListener(
      "click",
      () => {
        selectMediaTab("gifs");
      }
    );


    /* =========================================
       ENVIAR MENSAJE
    ========================================= */

    form.addEventListener(
      "submit",
      async (event) => {
        event.preventDefault();


        if (!user) {
          return;
        }


        const text =
          messageInput.value.trim();


        if (
          !text ||
          !nickname
        ) {
          return;
        }


        const cleanMessage =
          text.substring(
            0,
            250
          );


        messageInput.value =
          "";


        try {
          await sendMessage({
            uid: user.uid,
            nickname,
            message:
              cleanMessage,
            color:
              profile.color,

            icon:
              profile.icon,
          });

        } catch (error) {
          console.error(
            "❌ No se pudo enviar el mensaje:",
            error
          );


          messageInput.value =
            cleanMessage;
        }
      }
    );


    /* =========================================
       INICIAR CHAT
    ========================================= */

    const existingUser =
      await waitForAuth();

    if (
      existingUser &&
      !existingUser.isAnonymous
    ) {
      // Google / cuenta permanente:
      // entra automáticamente.
      await loadUser(existingUser);
    } else {
      // Invitado o usuario sin sesión:
      // mostramos siempre la pantalla inicial.
      user = existingUser;

      openAuth();
    }

  } catch (error) {
    console.error(
      "❌ Error iniciando Smonk Chat:",
      error
    );
  }
}