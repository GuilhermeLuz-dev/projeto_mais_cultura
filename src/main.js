import { getUserState, logout } from "./firebase/auth";
import { searchEvents } from "./firebase/firestore";

const buttonEvent = document.getElementById("buttonEvents");
const btnCreateEvent = document.getElementById("btnCreateEvent");
const btnLogout = document.getElementById("btnLogout");

// Função para atualizar o estado da página com base no usuário logado
const updatePageState = async () => {
  try {
    const user = await getUserState();
    if (user) {
      console.log("Usuário logado:", user);
      btnCreateEvent.style.display = "inline"; // Exibe o botão de criar evento
      btnLogout.style.display = "inline"; // Exibe o botão de logout
    } else {
      console.log("Nenhum usuário logado.");
      btnCreateEvent.style.display = "none"; // Esconde o botão de criar evento
      btnLogout.style.display = "none"; // Esconde o botão de logout
    }
  } catch (error) {
    console.error("Erro ao atualizar o estado da página:", error);
  }
};

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

// Listando TODOS os eventos existentes
const listAllEvents = async () => {
  const eventsContainer = document.getElementById("events");
  const eventos = await searchEvents();

  eventos.forEach((event) => {
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
};

// Listando eventos por categoria

const listEventsByCategory = async (category) => {
  const data = await searchEvents(category);
  console.log(data);
};

buttonEvent.addEventListener("click", listAllEvents);
btnLogout.addEventListener("click", logoutUser);
document.getElementById("currentUser").addEventListener("click", getUserState);
// Verificando se o usuário está logado
document.addEventListener("DOMContentLoaded", updatePageState);

export { updatePageState };
