import { searchEvents, addNewEvent } from "./firebase/firestore";

const buttonEvent = document.getElementById("buttonEvents");

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

    // Adicionando os valores
    title.textContent = event.titulo;
    pDesc.textContent = event.descricao;
    pData.textContent = `Data: ${event.data}`;
    pEndereco.textContent = `Endereço: ${event.endereco}`;
    pCategoria.textContent = `Categoria: ${event.categoria}`;

    // Adicionando os elementos ao <li>
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

const listEventsByCategory = async () => {
  const data = await searchEvents("esporte");
  console.log(data);
};

buttonEvent.addEventListener("click", listAllEvents);
listEventsByCategory();
