import { getUserState } from "../firebase/auth";
import { searchEvents, getEventById } from "../firebase/firestore";

const btnUserEvents = document.getElementById("btnUserEvents");
const btnListFavorite = document.getElementById("btnListFavorite");
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

    // Adicionando os valores
    title.textContent = event.titulo;
    pDesc.textContent = event.descricao;
    pData.textContent = `Data: ${event.data}`;
    pEndereco.textContent = `Endereço: ${event.endereco}`;
    pCategoria.textContent = `Categoria: ${event.categoria}`;
    img.src = event.imagemUrl;
    li.id = event.id;

    // Adicionando os elementos ao <li>
    li.appendChild(img);
    li.appendChild(title);
    li.appendChild(pDesc);
    li.appendChild(pData);
    li.appendChild(pEndereco);
    li.appendChild(pCategoria);
    // Adicionando o <li> ao container
    eventsContainer.appendChild(li);
  });
  return eventsContainer;
};

// Teste de listagem de eventos do usuário
btnUserEvents.addEventListener("click", async () => {
  const user = await getUserState();
  eventsUser.innerHTML = "";
  eventsUser.appendChild(
    await listUserEvents(await searchEvents("userUID", user.uid))
  );
});

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
