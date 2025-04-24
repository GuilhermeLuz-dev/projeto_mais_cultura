import { db } from "./firebaseConfig";
import { getDocs, addDoc, collection, query, where } from "firebase/firestore";

// Referências de coleções
const eventsRef = collection(db, "eventos");
const usersRef = collection(db, "usuarios");

// Função que adiciona um novo evento
const addNewEvent = async (event) => {
  try {
    const docRef = await addDoc(eventsRef, event);
    console.log(`Novo evento adicionado com sucesso: ${docRef.id}`);
  } catch (error) {
    console.error(error);
  }
};

// Função que pode retornar todos os eventos ou apenas eventos por categoria.
const searchEvents = async (filter, value) => {
  let querySnapshot = {};
  if (filter) {
    const q = query(eventsRef, where(filter, "==", value));
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

// Função que adiciona dados de novo usuário
const addNewUser = async (user) => {
  try {
    const docRef = await addDoc(usersRef, user);
    console.log(`Novo usuário adicionado com sucesso: ${docRef.id}`);
  } catch (error) {
    console.error(error);
  }
};

// Pegando dados de usuário logado por UID
const getUserData = async (uid) => {
  let querySnapshot = {};

  const q = query(usersRef, where("uid", "==", uid));
  querySnapshot = await getDocs(q);

  const data = [];
  querySnapshot.forEach((doc) => {
    data.push(doc.data());
  });

  return data;
};

export { searchEvents, addNewEvent, addNewUser, getUserData };
