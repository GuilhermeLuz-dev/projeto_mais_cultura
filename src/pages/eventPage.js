import { getEventById } from "../firebase/firestore.js";
import { formatDate } from "../scripts/formatDatas.js";
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const eventName = document.getElementById("eventName");
const eventDate = document.getElementById("eventDate");
const eventLocation = document.getElementById("eventLocation");
const imageEvent = document.getElementById("imageEvent");
const eventDescription = document.getElementById("eventDescription");
const organizerName = document.getElementById("organizerName");
const organizerDesc = document.getElementById("organizerDesc");
const organizerTel = document.getElementById("organizerTel");
const organizerEmail = document.getElementById("organizerEmail");
const startDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");
const startTime = document.getElementById("startTime");
const endTime = document.getElementById("endTime");

const getDateTime = (event) => {
  const startDateEvent = formatDate(new Date(event.data.startDate));
  const endDateEvent = formatDate(new Date(event.data.endDate));

  eventDate.innerHTML = `<p>${startDateEvent.day}</p> <strong>${startDateEvent.month}</strong>`;

  startDate.innerText = startDateEvent.day
    ? `${startDateEvent.day}/${startDateEvent.month}/${startDateEvent.year}`
    : "Sem data de início";

  endDate.innerText = endDateEvent.day
    ? `${endDateEvent.day}/${endDateEvent.month}/${endDateEvent.year}`
    : "Sem data de término";

  startTime.innerText = event.data.startTime;
  endTime.innerText = event.data.endTime;
};

document.addEventListener("DOMContentLoaded", async () => {
  const event = await getEventById(id);

  imageEvent.src = event.imagemUrl;
  eventName.innerText = event.titulo;
  eventLocation.innerHTML = event.endereco.nomeLocal;
  eventDescription.innerText = event.descricao;
  organizerName.innerText = event.organizer.name;
  organizerDesc.innerText = event.organizer.desc;
  organizerTel.innerText = event.organizer.tel;
  organizerEmail.innerText = event.organizer.mail;
  getDateTime(event);
});
