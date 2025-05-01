import { addNewEvent } from "../firebase/firestore";
import { getImageUrl } from "../supabase/supabaseclient";
import { getUserState } from "../firebase/auth";

const formButton = document.getElementById("formButton");

// Adicionando novo evento
formButton.addEventListener("click", async (event) => {
  event.preventDefault();

  const tituloValue = document.getElementById("titulo").value;
  const descricaoValue = document.getElementById("descricao").value;
  const categoriaValue = document.getElementById("categoria").value;
  const dateValue = document.getElementById("date").value;
  const enderecoValue = document.getElementById("endereco").value;
  const fileInput = document.getElementById("fileInput");
  const url = await getImageUrl(fileInput.files[0]);
  const userUID = await getUserState();
  console.log(url);
  const newEvent = {
    titulo: tituloValue,
    descricao: descricaoValue,
    categoria: categoriaValue,
    data: dateValue,
    endereco: enderecoValue,
    imagemUrl: url,
    imageName: fileInput.files[0].name,
    userUID: userUID.uid,
    emDestaque: false,
  };
  addNewEvent(newEvent);
});
