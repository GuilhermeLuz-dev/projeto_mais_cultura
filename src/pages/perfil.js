import { getUserState } from "../firebase/auth";
import {
  searchEvents,
  removeEvent,
  highlightingEvent,
} from "../firebase/firestore";
import { formatDate } from "../scripts/formatDatas";
import { deleteImage } from "../supabase/supabaseClient";
import { showFeedback } from "../main";

const nameContainer = document.getElementById("nameContainer");
const eventsCardsContainer = document.getElementById("eventsCardsContainer");
const feedbackContainer = document.getElementById("feedback");

const handleFeedback = async (msg, type) => {
  feedbackContainer.innerHTML = "";
  feedbackContainer.appendChild(await showFeedback(msg, type));
  setTimeout(() => {
    feedbackContainer.innerHTML = "";
  }, 3000);
};

// Função que atualiza página do usuário
const updateUserPage = async () => {
  const user = await getUserState();
  console.log(user);
  if (user) {
    nameContainer.innerHTML = user.nome;
    const eventsContainer = await listUserEvents(user.uid);
    eventsCardsContainer.innerHTML = "";
    eventsCardsContainer.appendChild(eventsContainer);
  } else {
    window.location.href = "index.html";
  }
};

const btnUserEventsConfig = (event) => {
  const btnsContainer = document.createElement("div");
  btnsContainer.className = "btns-events-container";

  // Botão de remover evento;
  const btnDelete = document.createElement("button");
  btnDelete.classList.add("btn", "btn-primary");
  btnDelete.textContent = "Deletar";
  btnDelete.addEventListener("click", async () => {
    if (window.confirm("Tem certeza que deseja deletar?")) {
      await removeEvent(event.id);
      await deleteImage(event.imageName);
      await updateUserPage();
      handleFeedback("Evento removido com sucesso!", "success");
    } else {
      handleFeedback("Evento não removido!", "alert");
    }
  });

  // Botão de solicitar destaque;
  const btnHighlight = document.createElement("button");
  btnHighlight.classList.add("btn", "btn-primary");
  console.log(event.emDestaque);
  btnHighlight.textContent = event.emDestaque
    ? "Remover destaque"
    : "Solicitar destaque";

  btnHighlight.addEventListener("click", async (e) => {
    if (e.target.textContent == "Solicitar destaque") {
      btnHighlight.textContent = "Remover destaque";
      const msg = await highlightingEvent(event.id);
      handleFeedback(msg, "success");
    } else {
      btnHighlight.textContent = "Solicitar destaque";
      const msg = await highlightingEvent(event.id);
      handleFeedback(msg, "success");
    }
  });

  const btnEdit = document.createElement("button");
  btnEdit.classList.add("btn", "btn-primary");
  btnEdit.textContent = "Editar";
  // Adicionando evento ao botão de edição;
  btnEdit.addEventListener("click", () => {
    window.location.href = `formEditEvent.html?id=${event.id}`;
  });

  btnsContainer.append(btnEdit, btnHighlight, btnDelete);

  return btnsContainer;
};

const listUserEvents = async (uid) => {
  const events = await searchEvents("userUID", uid);
  const cardsContainer = document.createElement("div");
  cardsContainer.className = "event-cards";
  events.forEach((event) => {
    const card = document.createElement("div");
    card.className = "event-card";

    const imageContainer = document.createElement("div");
    imageContainer.className = "image-wrapper";

    const image = document.createElement("img");
    image.src = event.imagemUrl;
    image.alt = event.titulo;
    imageContainer.appendChild(image);

    const infoContainer = document.createElement("div");
    infoContainer.className = "event-info";

    const title = document.createElement("h3");
    title.textContent = event.titulo;

    const andressAndDateContainer = document.createElement("span");
    const date = formatDate(new Date(event.data.startDate));
    andressAndDateContainer.innerHTML += `<strong>${date.day}${date.month}</strong> | ${event.endereco.nomeLocal}`;
    infoContainer.append(title, andressAndDateContainer);

    card.append(imageContainer, infoContainer, btnUserEventsConfig(event));
    cardsContainer.appendChild(card);
  });
  return cardsContainer;
};

const listUserFavorites = async (uid) => {
  const events = await searchEvents("userUID", uid);
  const cardsContainer = document.createElement("div");
  cardsContainer.className = "event-cards";
  events.forEach((event) => {
    const card = document.createElement("div");
    card.className = "event-card";

    const imageContainer = document.createElement("div");
    imageContainer.className = "image-wrapper";

    const image = document.createElement("img");
    image.src = event.imagemUrl;
    image.alt = event.titulo;
    imageContainer.appendChild(image);

    const infoContainer = document.createElement("div");
    infoContainer.className = "event-info";

    const title = document.createElement("h3");
    title.textContent = event.titulo;

    const andressAndDateContainer = document.createElement("span");
    const date = formatDate(new Date(event.data.startDate));
    andressAndDateContainer.innerHTML += `<strong>${date.day}${date.month}</strong> | ${event.endereco.nomeLocal}`;
    infoContainer.append(title, andressAndDateContainer);

    card.append(imageContainer, infoContainer, btnUserEventsConfig(event));
    cardsContainer.appendChild(card);
  });
  return cardsContainer;
};

document.addEventListener("DOMContentLoaded", async () => {
  updateUserPage();
});
