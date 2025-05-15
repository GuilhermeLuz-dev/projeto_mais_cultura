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
const cardsContainer = document.getElementById("eventsCardsContainer");

// Função que atualiza página do usuário
const updateUserPage = async () => {
  const user = await getUserState();
  console.log(user);
  if (user) {
    nameContainer.innerHTML = user.nome;
    cardsContainer.innerHTML = "";
    listUserEvents(user.uid);
  } else {
    window.location.href = "index.html";
  }
};

const btnUserEventsConfig = (event) => {
  const btnsContainer = document.createElement("div");
  btnsContainer.className = "btns-events-container";

  // Botão de remover evento;
  const btnDelete = document.createElement("button");
  btnDelete.classList.add("btn", "btn-primary", "alert");
  btnDelete.textContent = "Deletar";
  btnDelete.addEventListener("click", async () => {
    if (window.confirm("Tem certeza que deseja deletar?")) {
      await removeEvent(event.id);
      await deleteImage(event.imageName);
      await updateUserPage();
      showFeedback("Evento removido com sucesso!", "success");
      console.log(event);
    } else {
      showFeedback("Evento não removido!", "alert");
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
      showFeedback(msg, "success");
    } else {
      btnHighlight.textContent = "Solicitar destaque";
      const msg = await highlightingEvent(event.id);
      showFeedback(msg, "success");
    }
  });

  const btnEdit = document.createElement("button");
  btnEdit.classList.add("btn", "btn-primary", "success");
  btnEdit.textContent = "Editar";
  // Adicionando evento ao botão de edição;
  btnEdit.addEventListener("click", () => {
    window.location.href = `formEditEvent.html?id=${event.id}`;
    // formEdit.style.display = "inline";
    // // Salvando edição
    // btnSaveEdited.addEventListener("click", async (e) => {
    //   e.preventDefault();
    //   const newsData = await getDataForEdit(event.imageName);
    //   eventEdit(event.id, newsData);
    // });

    // btnCancelEdited.addEventListener("click", (e) => {
    //   e.preventDefault();
    //   formEdit.style.display = "none";
    // });
  });

  btnsContainer.append(btnEdit, btnHighlight, btnDelete);

  return btnsContainer;
};

const listUserEvents = async (uid) => {
  const events = await searchEvents("userUID", uid);
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
};

document.addEventListener("DOMContentLoaded", async () => {
  updateUserPage();
  showFeedback("Página carregada com sucesso!");
});
