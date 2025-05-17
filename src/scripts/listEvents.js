import {
  searchEvents,
  addEventToFavorites,
  removeEventFromFavorites,
} from "../firebase/firestore";
import { configSwiper } from "./swiperConfig";
import { formatDate } from "./formatDatas";
import { getUserState } from "../firebase/auth";
import { showFeedback } from "../main";

const carrousselContainer = document.getElementById("carroussel");
const feedbackContainer = document.getElementById("feedbackContainer");
const entertainmentCategoryContainer = document.getElementById(
  "entertainmentCategoryContainer"
);
const sportsCategoryContainer = document.getElementById(
  "sportsCategoryContainer"
);
const theaterCategoryContainer = document.getElementById(
  "theaterCategoryContainer"
);
const exhibitionCategoryContainer = document.getElementById(
  "exhibitionCategoryContainer"
);
const educationCategoryContainer = document.getElementById(
  "educationCategoryContainer"
);

// Listando os eventos destacados para o carroussel
const listFeaturedEvents = async (eventsList) => {
  let swiper = document.createElement("div");
  swiper.className = "swiper";

  let eventsContainer = document.createElement("div");
  eventsContainer.className = "swiper-wrapper";

  let pagination = document.createElement("div");
  pagination.className = "swiper-pagination";
  let buttonPrev = document.createElement("div");
  buttonPrev.className = "swiper-button-prev";
  let buttonNext = document.createElement("div");
  buttonNext.className = "swiper-button-next";
  let scrollbar = document.createElement("div");
  scrollbar.className = "swiper-scrollbar";
  swiper.append(pagination, buttonPrev, buttonNext, scrollbar);

  eventsList.forEach((event) => {
    // Criando os elementos
    const slide = document.createElement("div");
    slide.className = "swiper-slide";

    const pDesc = document.createElement("p");
    pDesc.className = "slider-text";
    pDesc.textContent = event.descricao;

    const img = document.createElement("img");
    img.src = event.imagemUrl;

    slide.id = event.id;

    slide.append(img, pDesc);

    eventsContainer.appendChild(slide);
  });
  swiper.appendChild(eventsContainer);
  return swiper;
};

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
  const favorited = "./public/images/icons/favorited.png";
  const notFavorited = "./public/images/icons/heart.png";

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

const getEventsByCategory = async (container, category) => {
  const listEvents = await listEventsByCategory(
    await searchEvents("categoria", category)
  );

  if (!listEvents.textContent) {
    container.parentNode.textContent = "";
  }

  if (container) {
    container.innerHTML = " ";
    container.appendChild(listEvents);
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  // Listando eventos em destaque no carrosel
  const eventsFeatureds = await listFeaturedEvents(
    await searchEvents("emDestaque", true)
  );
  if (eventsFeatureds.querySelectorAll(".swiper-slide").length > 0) {
    carrousselContainer.innerHTML = "";
    carrousselContainer.prepend(eventsFeatureds);
  }
  configSwiper();

  // Listando eventos por categoria
  await getEventsByCategory(entertainmentCategoryContainer, "entretenimento");
  await getEventsByCategory(sportsCategoryContainer, "esporte");
  await getEventsByCategory(theaterCategoryContainer, "teatro");
  await getEventsByCategory(exhibitionCategoryContainer, "exposicao");
  await getEventsByCategory(educationCategoryContainer, "educacao");
});
