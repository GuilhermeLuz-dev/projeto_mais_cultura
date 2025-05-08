import { addNewEvent } from "../src/firebase/firestore";
import { getImageUrl } from "../src/supabase/supabaseclient";
import { getUserState } from "../src/firebase/auth";

const btnCadastrar = document.getElementById("btn_cadastrar");

const getInfosDate = () => {
  const dateValues = {};
  dateValues.startDate = document.getElementById("start_date").value;
  dateValues.endDate = document.getElementById("end_date").value;
  dateValues.startTime = document.getElementById("start_time").value;
  dateValues.endTime = document.getElementById("end_time").value;
  return dateValues;
};

const getLocationData = () => {
  const locationData = {};
  locationData.cep = document.getElementById("cep").value;
  locationData.cidade = document.getElementById("cidade").value;
  locationData.bairro = document.getElementById("bairro").value;
  locationData.logradouro = document.getElementById("logradouro").value;
  locationData.numero = document.getElementById("numero").value;
  locationData.complemento = document.getElementById("complemento").value;
  locationData.nomeLocal = document.getElementById("nomeLocal").value;
  return locationData;
};

const getOrganizerData = () => {
  const organizerData = {};
  organizerData.name = document.getElementById("organizerName").value;
  organizerData.desc = document.getElementById("organizerDesc").value;
  return organizerData;
};

// Adicionando novo evento
btnCadastrar.addEventListener("click", async () => {
  const tituloValue = document.getElementById("eventName").value;
  const descricaoValue = document.getElementById("descricao").value;
  const categoriaValue = document.getElementById("categoria").value;
  const fileInput = document.getElementById("imagem-upload");
  const url = await getImageUrl(fileInput.files[0]);
  const dateValues = getInfosDate();
  const enderecoValues = getLocationData();
  const organizerData = getOrganizerData();
  const userUID = await getUserState();

  const newEvent = {
    titulo: tituloValue,
    descricao: descricaoValue,
    categoria: categoriaValue,
    data: dateValues,
    endereco: enderecoValues,
    imagemUrl: url,
    imageName: fileInput.files[0].name,
    organizer: organizerData,
    userUID: userUID.uid,
    emDestaque: false,
  };
  console.log(newEvent);
  addNewEvent(newEvent);
});
