import { searchEvents } from "../src/firebase/firestore";
import { configSwiper } from "./swiperConfig";

const carrousselContainer = document.getElementById("carroussel");

// Formatando datas
const formatDate = (date) => {
  const mesesAbreviados = [
    "JAN",
    "FEV",
    "MAR",
    "ABR",
    "MAI",
    "JUN",
    "JUL",
    "AGO",
    "SET",
    "OUT",
    "NOV",
    "DEZ",
  ];

  // Extrair dia e mês
  const day = date.getDate();
  const month = mesesAbreviados[date.getMonth()];

  // Montar a string no formato desejado
  return `${day} ${month}`;
};

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

const listEventsByCategory = async (events) => {
  const categoryContainer = document.getElementById("first-category-container");

  events.forEach((event) => {
    const card = document.createElement("div");
    card.className = "event-one-card";

    const img = document.createElement("img");
    img.src = event.imagemUrl;

    const infoContainer = document.createElement("div");
    infoContainer.className = "event-info";

    const title = document.createElement("h3");
    title.textContent = event.titulo;

    const andressAndDateContainer = document.createElement("span");
    const date = formatDate(new Date(event.data));
    andressAndDateContainer.innerHTML += `<strong>${date}</strong> | ${event.endereco}`;

    infoContainer.append(title, andressAndDateContainer);
    card.append(img, infoContainer);
    categoryContainer.appendChild(card);
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  carrousselContainer.prepend(
    await listFeaturedEvents(await searchEvents("emDestaque", true))
  );
  configSwiper();
  listEventsByCategory(await searchEvents("categoria", "Show"));
});
