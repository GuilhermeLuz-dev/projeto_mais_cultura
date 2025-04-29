import { getUserState, deleteAccount } from "../firebase/auth";
import {
  searchEvents,
  getEventById,
  removeEvent,
  highlightingEvent,
  eventEdit,
} from "../firebase/firestore";

import { getImageUrl } from "../supabase/supabaseclient";

// Elementos HTML
const btnUserEvents = document.getElementById("btnUserEvents");
const btnListFavorite = document.getElementById("btnListFavorite");
const btnDeleteAccont = document.getElementById("btnDeleteAccont");
const btnSaveEdited = document.getElementById("btnSaveEdited");

const formEdit = document.getElementById("formEdit");
const eventsUser = document.getElementById("myEvents");

// Listando TODOS os eventos existentes
const listUserEvents = (eventsList) => {
  let eventsContainer = document.createElement("ul");
  eventsList.forEach((event) => {
    // Criando os elementos
    const li = document.createElement("li");
    const title = document.createElement("h2");
    const pDesc = document.createElement("p");
    const pData = document.createElement("p");
    const pEndereco = document.createElement("p");
    const pCategoria = document.createElement("p");
    const img = document.createElement("img");
    const btnDelete = document.createElement("button");
    const btnHighlight = document.createElement("button");
    const btnEditEvent = document.createElement("button");

    // Adicionando os valores
    title.textContent = event.titulo;
    pDesc.textContent = event.descricao;
    pData.textContent = `Data: ${event.data}`;
    pEndereco.textContent = `Endereço: ${event.endereco}`;
    pCategoria.textContent = `Categoria: ${event.categoria}`;
    btnDelete.textContent = "Deletar";
    btnHighlight.textContent = event.emDestaque
      ? "Remover dos Destaques"
      : "Solicitar Destaque";
    btnEditEvent.textContent = "Editar";
    img.src = event.imagemUrl;
    li.id = event.id;

    // Adicionando evento aos botões
    btnDelete.addEventListener("click", async () => {
      if (window.confirm("Tem certeza que deseja deletar?")) {
        await removeEvent(li.id);
        await updateUserPage();
      } else {
        alert("Não removido");
      }
    });

    btnHighlight.addEventListener("click", (e) => {
      if (e.target.textContent == "Solicitar destaque") {
        btnHighlight.textContent = "Remover dos destaques";
        highlightingEvent(li.id);
      } else {
        btnHighlight.textContent = "Solicitar destaque";
        highlightingEvent(li.id);
      }
    });

    btnEditEvent.addEventListener("click", () => {
      formEdit.style.display = "inline";
      // Salvando edição
      btnSaveEdited.addEventListener("click", async (e) => {
        e.preventDefault();
        const newsData = await getDataForEdit();
        eventEdit(event.id, newsData);
      });
    });

    // Adicionando os elementos ao <li>
    li.append(
      img,
      title,
      pDesc,
      pData,
      pEndereco,
      pCategoria,
      btnDelete,
      btnHighlight,
      btnEditEvent
    );

    // Adicionando o <li> ao container
    eventsContainer.appendChild(li);
  });
  return eventsContainer;
};

// Função que atualiza página do usuário
const updateUserPage = async () => {
  const user = await getUserState();
  eventsUser.innerHTML = "";
  eventsUser.appendChild(
    listUserEvents(await searchEvents("userUID", user.uid))
  );
};

// Função que pegar os dados editados
const getDataForEdit = async () => {
  const tituloValue = document.getElementById("tituloEdited").value;
  const descricaoValue = document.getElementById("descricaoEdited").value;
  const categoriaValue = document.getElementById("categoriaEdited").value;
  const dateValue = document.getElementById("dateEdited").value;
  const enderecoValue = document.getElementById("enderecoEdited").value;
  const fileInput = document.getElementById("fileInputEdited");
  const url = fileInput.files[0] ? await getImageUrl(fileInput.files[0]) : "";

  const newsData = {};
  if (tituloValue) newsData.titulo = tituloValue;
  if (descricaoValue) newsData.descricao = descricaoValue;
  if (categoriaValue) newsData.categoria = categoriaValue;
  if (dateValue) newsData.data = dateValue;
  if (enderecoValue) newsData.endereco = enderecoValue;
  if (url) newsData.imagemUrl = url;

  return newsData;
};

// Teste de listagem de eventos do usuário
btnUserEvents.addEventListener("click", async () => {
  const user = await getUserState();
  eventsUser.innerHTML = "";
  eventsUser.appendChild(
    await listUserEvents(await searchEvents("userUID", user.uid))
  );
});

// Teste de listagem de favoritos
btnListFavorite.addEventListener("click", async () => {
  const user = await getUserState();
  const favorites = user.favoritos;
  const eventsFavorites = await Promise.all(
    favorites.map(async (favorite) => {
      return await getEventById(favorite);
    })
  );

  eventsUser.appendChild(await listUserEvents(eventsFavorites));
});

// Deletando conta do usuário

btnDeleteAccont.addEventListener("click", () => {
  if (window.confirm("Tem certeza que deseja excluir sua conta?")) {
    deleteAccount();
    return;
  }
  alert("Conta NÃO cancelada");
});
