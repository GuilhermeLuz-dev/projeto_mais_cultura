import { searchEvents } from "./firebase/firestore";
const eventos = await searchEvents();

const titulo = eventos[0].titulo;
const descricao = eventos[0].descriçao;
const data = eventos[0].data;

document.getElementById("title").innerHTML = titulo;
document.getElementById("desc").innerHTML = descricao;
document.getElementById("data").innerHTML = data.toDate();
