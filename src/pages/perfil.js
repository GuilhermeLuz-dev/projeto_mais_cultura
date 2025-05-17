import { getUserState } from "../firebase/auth";
import {
  searchEvents,
  removeEvent,
  highlightingEvent,
  getEventById,
  addEventToFavorites,
  removeEventFromFavorites,
} from "../firebase/firestore";
import { formatDate } from "../scripts/formatDatas";
import { deleteImage } from "../supabase/supabaseClient";
import { showFeedback } from "../main";

const nameContainer = document.getElementById("nameContainer");
const eventsCardsContainer = document.getElementById("eventsCardsContainer");
const feedbackContainer = document.getElementById("feedbackContainer");
const btnUserEvents = document.getElementById("btnUserEvents");
const btnFavorite = document.getElementById("btnFavorite");

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
  let eventsContainer;
  if (user) {
    nameContainer.innerHTML = user.nome;
    if (btnUserEvents.classList.contains("btn-active")) {
      eventsContainer = await listUserEvents(user.uid);
    } else {
      eventsContainer = await listUserFavorites(user.uid);
    }
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
      handleFeedback("Aguarde um momento...", "info");
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
    handleFeedback("Aguarde um momento...", "info");
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
    card.className = "event-one-card";

    const imageContainer = document.createElement("div");
    imageContainer.className = "image-wrapper";
    imageContainer.addEventListener("click", () => {
      window.location.href = `event.html?id=${event.id}`;
    });

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

// Função que adiciona evento aos favoritos
const handleFavorite = async (idEvent, icon, user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  handleFeedback("Aguarde um momento...", "info");
  if (icon.src.includes("favorited")) {
    icon.src = "images/icons/heart.png";
    const result = await removeEventFromFavorites(idEvent);
    if (result) {
      handleFeedback("Evento removido dos favoritos com sucesso.", "success");
    } else {
      handleFeedback("Erro ao remover evento dos favoritos.", "alert");
    }
  } else {
    const result = await addEventToFavorites(idEvent);
    icon.src = "images/icons/favorited.png";
    if (result) {
      handleFeedback("Evento adicionado aos favoritos com sucesso.", "success");
    } else {
      handleFeedback("Erro ao adicionar evento aos favoritos.", "alert");
    }
  }
  updateUserPage();
};

const listUserFavorites = async () => {
  const user = await getUserState();

  const favorites = user.favoritos;

  const eventsFavorites = [];

  console.log(favorites);
  for (const favorite of favorites) {
    const event = await getEventById(favorite);
    if (event) {
      eventsFavorites.push({ ...event, id: favorite });
    }
  }

  const cardsContainer = document.createElement("div");
  cardsContainer.className = "event-cards";

  console.log(eventsFavorites);
  eventsFavorites.forEach((event) => {
    const card = document.createElement("div");
    card.className = "event-one-card";

    const imageContainer = document.createElement("div");
    imageContainer.className = "image-wrapper";

    const image = document.createElement("img");
    image.src = event.imagemUrl;
    image.alt = event.titulo;
    imageContainer.appendChild(image);

    const favoriteContainer = document.createElement("div");
    favoriteContainer.className = "favorite-container";
    const favoriteIcon = document.createElement("img");

    favoriteIcon.src = user.favoritos.includes(event.id)
      ? "./public/images/icons/favorited.png"
      : "./public/images/icons/heart.png";

    favoriteIcon.className = "favorite-icon";
    favoriteIcon.addEventListener("click", (e) => {
      handleFavorite(event.id, e.target, user);
    });
    favoriteContainer.appendChild(favoriteIcon);

    const infoContainer = document.createElement("div");
    infoContainer.className = "event-info";

    const title = document.createElement("h3");
    title.textContent = event.titulo;

    const andressAndDateContainer = document.createElement("span");
    const date = formatDate(new Date(event.data.startDate));
    andressAndDateContainer.innerHTML += `<strong>${date.day}${date.month}</strong> | ${event.endereco.nomeLocal}`;
    infoContainer.append(title, andressAndDateContainer);

    card.append(imageContainer, infoContainer, favoriteContainer);
    cardsContainer.appendChild(card);
  });
  return cardsContainer;
};

btnFavorite.addEventListener("click", async () => {
  handleFeedback("Aguarde um momento...", "info");
  btnUserEvents.classList.remove("btn-active");
  btnFavorite.classList.add("btn-active");
  updateUserPage();
});

btnUserEvents.addEventListener("click", async () => {
  handleFeedback("Aguarde um momento...", "info");

  btnUserEvents.classList.add("btn-active");
  btnFavorite.classList.remove("btn-active");
  updateUserPage();
});

document.addEventListener("DOMContentLoaded", async () => {
  updateUserPage();
});
