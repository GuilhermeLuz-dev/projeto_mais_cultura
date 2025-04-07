import { addNewEvent } from "../firebase/firestore";

// Adicionando novo evento
const formButton = document.getElementById("formButton");
formButton.addEventListener("click", (event) => {
  event.preventDefault();

  const tituloValue = document.getElementById("titulo").value;
  const descricaoValue = document.getElementById("descricao").value;
  const categoriaValue = document.getElementById("categoria").value;
  const dateValue = document.getElementById("date").value;
  const enderecoValue = document.getElementById("endereco").value;

  const newEvent = {
    titulo: tituloValue,
    descricao: descricaoValue,
    categoria: categoriaValue,
    data: dateValue,
    endereco: enderecoValue,
  };
  addNewEvent(newEvent);
});
