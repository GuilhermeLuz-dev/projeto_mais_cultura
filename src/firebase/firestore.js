import { db } from "./firebaseConfig";
import { getDocs, addDoc, collection, query, where } from "firebase/firestore";

const eventsRef = collection(db, "eventos");

// Função que pode retornar todos os eventos ou apenas eventos por categoria.
const searchEvents = async (category) => {
  let querySnapshot = {};
  if (category) {
    const q = query(eventsRef, where("categoria", "==", category));
    querySnapshot = await getDocs(q);
  } else {
    querySnapshot = await getDocs(eventsRef);
  }

  const data = [];
  querySnapshot.forEach((doc) => {
    data.push(doc.data());
  });

  return data;
};

// Função que adiciona um novo evento
const addNewEvent = async (event) => {
  try {
    const docRef = await addDoc(eventsRef, event);
    console.log(`Novo evento adicionado com sucesso: ${docRef.id}`);
  } catch (error) {
    console.error(error);
  }
};

export { searchEvents, addNewEvent };
