import { searchEvents } from "../firebase/firestore";
import { getUserState } from "../firebase/auth";
import { formatDate } from "../scripts/formatDatas.js";
import { showFeedback } from "../main";

const eventsContainer = document.getElementById(
  "entertainmentCategoryContainer"
);

const title = document.getElementById("categoryTitle");
const feedbackContainer = document.getElementById("feedbackContainer");

const handleFeedback = (message, type) => {
  feedbackContainer.innerHTML = "";
  feedbackContainer.appendChild(showFeedback(message, type));
  setTimeout(() => {
    feedbackContainer.innerHTML = "";
  }, 3000);
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
};

const handleIcon = (icon, user, id) => {
  const favorited = "./images/icons/favorited.png";
  const notFavorited = "./images/icons/heart.png";

  if (user) {
    if (user.favoritos) {
      if (user.favoritos.includes(id)) {
        icon.src = favorited;
      } else {
        icon.src = notFavorited;
      }
    } else {
      icon.src = notFavorited;
    }
  } else {
    icon.src = notFavorited;
  }
};

const listEventsByCategory = async (events) => {
  const user = await getUserState();
  const categoryContainer = document.createElement("div");
  categoryContainer.className = "event-cards";
  events.forEach((event) => {
    // Criando card
    const card = document.createElement("div");
    card.className = "event-one-card";
    card.addEventListener("click", (e) => {
      e.target.className == "favorite-icon"
        ? null
        : e.target.className == "favorite-container"
        ? null
        : (window.location.href = `event.html?id=${event.id}`);
    });
    // Criando imagem do card com icone de favoritar
    const img = document.createElement("img");
    img.src = event.imagemUrl;

    const favoriteContainer = document.createElement("div");
    favoriteContainer.className = "favorite-container";
    const favoriteIcon = document.createElement("img");
    handleIcon(favoriteIcon, user, event.id);

    favoriteIcon.className = "favorite-icon";
    favoriteIcon.addEventListener("click", (e) => {
      if (user) {
        handleFavorite(event.id, e.target, user);
      } else {
        window.location.href = "login.html";
      }
    });
    favoriteContainer.appendChild(favoriteIcon);

    // Criando containers de infromações do evento
    const infoContainer = document.createElement("div");
    infoContainer.className = "event-info";

    const title = document.createElement("h3");
    title.textContent = event.titulo;

    const andressAndDateContainer = document.createElement("span");
    const date = formatDate(new Date(event.data.startDate));
    andressAndDateContainer.innerHTML += `<strong>${date.day}${date.month}</strong> | ${event.endereco.nomeLocal}`;

    // Adicionando os elementos criados ao card
    infoContainer.append(title, andressAndDateContainer);
    card.append(img, infoContainer, favoriteContainer);
    categoryContainer.appendChild(card);
  });
  return categoryContainer;
};

document.addEventListener("DOMContentLoaded", async () => {
  const category = new URLSearchParams(window.location.search);
  const events = await searchEvents("categoria", category.get("category"));
  title.innerHTML = category.get("desc");
  if (events.length == 0) {
    handleFeedback("Nenhum evento encontrado.", "alert");
    eventsContainer.innerHTML = "Nenhum evento encontrado na categoria.";
    return;
  }
  eventsContainer.innerHTML = "";
  eventsContainer.appendChild(await listEventsByCategory(events));
});
