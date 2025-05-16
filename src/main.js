import { getUserState, logout } from "./firebase/auth";
import {
  searchEvents,
  addEventToFavorites,
  removeEventFromFavorites,
} from "./firebase/firestore";

// const eventsContainer = document.getElementById("events");
// const buttonEvent = document.getElementById("buttonEvents");
// const buttonFeaturedEvents = document.getElementById("buttonFeaturedEvents");
// const btnCreateEvent = document.getElementById("btnCreateEvent");
// const btnUserControl = document.getElementById("btnUserControl");

// Atualizando o estado da página ao fazer logout
const logoutUser = async () => {
  try {
    await logout();
    console.log("Usuário desconectado com sucesso!");
    updatePageState();
  } catch (error) {
    console.error("Erro ao desconectar:", error);
  }
};

// Listando os eventos existentes
// const listEvents = async (eventsList) => {
//   let eventsContainer = document.createElement("ul");
//   const user = await getUserState();

//   eventsList.forEach((event) => {
//     // Criando os elementos
//     const li = document.createElement("li");
//     const title = document.createElement("h2");
//     const pDesc = document.createElement("p");
//     const pData = document.createElement("p");
//     const pEndereco = document.createElement("p");
//     const pCategoria = document.createElement("p");
//     const img = document.createElement("img");
//     const btnFavorite = document.createElement("button");

//     // Adicionando os valores
//     title.textContent = event.titulo;
//     pDesc.textContent = event.descricao;
//     pData.textContent = `Data: ${event.data}`;
//     pEndereco.textContent = `Endereço: ${event.endereco}`;
//     pCategoria.textContent = `Categoria: ${event.categoria}`;
//     img.src = event.imagemUrl;
//     btnFavorite.textContent = user.favoritos
//       ? user.favoritos.includes(event.id)
//         ? "Desfavoritar"
//         : "favoritar"
//       : "favoritar";
//     li.id = event.id;

//     // Adicionando evento ao botão favoritar

//     btnFavorite.addEventListener("click", (e) => {
//       if (e.target.textContent === "favoritar") {
//         btnFavorite.textContent = "desfavoritar";
//         addEventToFavorites(li.id);
//       } else {
//         btnFavorite.textContent = "favoritar";
//         removeEventFromFavorites(li.id);
//       }
//     });

//     // Adicionando os elementos ao <li>
//     li.appendChild(img);
//     li.appendChild(title);
//     li.appendChild(pDesc);
//     li.appendChild(pData);
//     li.appendChild(pEndereco);
//     li.appendChild(pCategoria);
//     li.appendChild(btnFavorite);

//     // Adicionando o <li> ao container
//     eventsContainer.appendChild(li);
//   });
//   return eventsContainer;
// };

// Teste de listagem de todos os eventos
// buttonEvent.addEventListener("click", async () => {
//   eventsContainer.innerHTML = "";
//   eventsContainer.appendChild(await listEvents(await searchEvents()));
// });

// Teste de listagem de eventos em destaque
// buttonFeaturedEvents.addEventListener("click", async () => {
//   eventsContainer.appendChild(
//     await listEvents(await searchEvents("emDestaque", true))
//   );
// });

// document.getElementById("currentUser").addEventListener("click", getUserState);

const showFeedback = (message, status) => {
  const feedbackContainer = document.createElement("div");
  feedbackContainer.classList.add("feedback-container", status);
  feedbackContainer.textContent = message;
  return feedbackContainer;
};

export { showFeedback };
