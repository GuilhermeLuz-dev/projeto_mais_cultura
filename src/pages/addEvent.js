import { addNewEvent, eventEdit, getEventById } from "../firebase/firestore.js";
import { getImageUrl, deleteImage } from "../supabase/supabaseClient.js";
import { getUserState } from "../firebase/auth.js";
import { showFeedback } from "../main.js";

const buttonAdd = document.getElementById("btnAdd");
const feedbackContainer = document.getElementById("feedbackContainer");

// Pegando campos do formulário
const titulo = document.getElementById("eventName");
const descricao = document.getElementById("descricao");
const categoria = document.getElementById("categoria");
const startDate = document.getElementById("start_date");
const endDate = document.getElementById("end_date");
const startTime = document.getElementById("start_time");
const endTime = document.getElementById("end_time");
const cep = document.getElementById("cep");
const cidade = document.getElementById("cidade");
const bairro = document.getElementById("bairro");
const logradouro = document.getElementById("logradouro");
const numero = document.getElementById("numero");
const complemento = document.getElementById("complemento");
const nomeLocal = document.getElementById("nomeLocal");
const name = document.getElementById("organizerName");
const desc = document.getElementById("organizerDesc");
const telOrganizer = document.getElementById("organizerTel");
const mailOrganizer = document.getElementById("organizerMail");

const handleFeedback = (message, type) => {
  feedbackContainer.innerHTML = "";
  feedbackContainer.appendChild(showFeedback(message, type));
  setTimeout(() => {
    feedbackContainer.innerHTML = "";
  }, 3000);
};

const getCurrentEvent = async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const event = await getEventById(id);
  event.id = id;
  return event;
};

// Trocando de imagem
const changeImage = async (file, currentImageName) => {
  if (file) {
    console.log(file, currentImageName);
    await deleteImage(currentImageName);
    return await getImageUrl(file);
  } else {
    return null;
  }
};

const getInfosDate = () => {
  const dateValues = {};
  dateValues.startDate = startDate.value;
  dateValues.endDate = endDate.value;
  dateValues.startTime = startTime.value;
  dateValues.endTime = endTime.value;
  return dateValues;
};

const getLocationData = () => {
  const locationData = {};
  locationData.cep = cep.value;
  locationData.cidade = cidade.value;
  locationData.bairro = bairro.value;
  locationData.logradouro = logradouro.value;
  locationData.numero = numero.value;
  locationData.complemento = complemento.value;
  locationData.nomeLocal = nomeLocal.value;
  return locationData;
};

const getOrganizerData = () => {
  const organizerData = {};
  organizerData.name = name.value;
  organizerData.desc = desc.value;
  return organizerData;
};

const validateEventData = () => {
  if (!titulo.value.trim()) {
    handleFeedback("O título é obrigatório.", "alert");
    return false;
  }
  if (!descricao.value.trim()) {
    handleFeedback("A descrição é obrigatória.", "alert");
    return false;
  }
  if (!telOrganizer.value.trim()) {
    handleFeedback("O telefone do organizador é obrigatória.", "alert");
    return false;
  }
  if (!mailOrganizer.value.trim()) {
    handleFeedback("O Email do organizador é obrigatória.", "alert");
    return false;
  }
  if (
    !cidade.value.trim() ||
    !bairro.value.trim() ||
    !logradouro.value.trim() ||
    !numero.value.trim()
  ) {
    handleFeedback(
      "Todos os campos de endereço obrigatórios devem ser preenchidos.",
      "alert"
    );
    return false;
  }
  if (!nomeLocal.value.trim()) {
    handleFeedback("O nome do local é obrigatório.", "alert");
    return false;
  }
  if (!name.value.trim()) {
    handleFeedback("O nome do organizador é obrigatório.", "alert");
    return false;
  }
  return true;
};

// Adicionando novo evento
buttonAdd.addEventListener("click", async (e) => {
  if (!validateEventData()) {
    return;
  }
  handleFeedback("Adicionando evento...", "info");
  const tituloValue = titulo.value;
  const descricaoValue = descricao.value;
  const categoriaValue = categoria.value;
  const fileInput = document.getElementById("imagem-upload");
  const url = fileInput.files[0] ? await getImageUrl(fileInput.files[0]) : null;
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
    organizer: organizerData,
    userUID: userUID.uid,
    emDestaque: false,
    telOrganizer: telOrganizer.value,
    mailOrganizer: mailOrganizer.value,
  };

  if (fileInput.files[0]) {
    newEvent.imageName = fileInput.files[0].name;
    newEvent.imagemUrl = url;
  }

  if (e.target.textContent == "Publicar Evento") {
    const result = await addNewEvent(newEvent);
    if (result) {
      handleFeedback("Evento adicionado com sucesso!", "success");
      setTimeout(() => {
        window.location.href = "perfil.html";
      }, 3000);
    } else {
      handleFeedback("Erro ao adicionar evento", "alert");
    }
    return;
  }

  if (e.target.textContent == "Salvar Edição") {
    const currentEvent = await getCurrentEvent();
    console.log(currentEvent);
    if (newEvent.imageName) {
      await changeImage(fileInput.files[0], currentEvent.imageName);
    }
    const result = await eventEdit(currentEvent.id, newEvent);
    if (result) {
      handleFeedback("Evento editado com sucesso!", "success");
      setTimeout(() => {
        window.location.href = "perfil.html";
      }, 3000);
    } else {
      handleFeedback("Erro ao editar evento", "alert");
    }
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (id) {
    const event = await getCurrentEvent();
    titulo.value = event.titulo;
    descricao.value = event.descricao;
    categoria.value = event.categoria;
    startDate.value = event.data.startDate;
    endDate.value = event.data.endDate;
    startTime.value = event.data.startTime;
    endTime.value = event.data.endTime;
    cep.value = event.endereco.cep;
    cidade.value = event.endereco.cidade;
    bairro.value = event.endereco.bairro;
    logradouro.value = event.endereco.logradouro;
    numero.value = event.endereco.numero;
    complemento.value = event.endereco.complemento;
    nomeLocal.value = event.endereco.nomeLocal;
    name.value = event.organizer.name;
    desc.value = event.organizer.desc;
  }
});
