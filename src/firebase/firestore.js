import { getUserState } from "./auth";
import { db } from "./firebaseConfig";
import {
  getDoc,
  getDocs,
  addDoc,
  collection,
  query,
  where,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

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
    data.push({ ...doc.data(), id: doc.id });
  });

  return data;
};

// Função que retorna evento pelo ID do documento
const getEventById = async (id) => {
  try {
    const eventDocRef = doc(eventsRef, id);
    const eventDoc = await getDoc(eventDocRef);

    if (eventDoc.exists()) {
      return eventDoc.data();
    } else {
      console.log("Nenhum evento encontrado com esse ID.");
      return null;
    }
  } catch (error) {
    console.error("Erro ao buscar evento pelo ID:", error);
    return null;
  }
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

// Adicionando evento aos favoritos
const addEventToFavorites = async (idEvent) => {
  const user = await getUserState();
  const id = await getIdForUID(user.uid);
  try {
    const userDocRef = doc(usersRef, id);
    await updateDoc(userDocRef, {
      favoritos: arrayUnion(idEvent),
    });
    console.log(`Evento ${idEvent} adicionado aos favoritos com sucesso.`);
  } catch (error) {
    console.error("Erro ao adicionar evento aos favoritos:", error);
  }
};

// Removendo evento dos favoritos
const removeEventFromFavorites = async (idEvent) => {
  const user = await getUserState();
  const id = await getIdForUID(user.uid);
  try {
    const userDocRef = doc(usersRef, id);
    await updateDoc(userDocRef, {
      favoritos: arrayRemove(idEvent),
    });
    console.log(`Evento ${idEvent} removido dos favoritos com sucesso.`);
  } catch (error) {
    console.error("Erro ao remover evento dos favoritos:", error);
  }
};

// Função que retorna ID pelo uid do usuário
const getIdForUID = async (uid) => {
  const q = query(usersRef, where("uid", "==", uid));

  try {
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return new Promise((resolve) => {
        querySnapshot.forEach((doc) => {
          const documentoId = doc.id;
          console.log("ID do documento encontrado:", documentoId);
          resolve(documentoId);
        });
      });
    } else {
      console.log("Nenhum documento encontrado com esse valor.");
      return Promise.resolve(null);
    }
  } catch (error) {
    console.error("Erro ao buscar o documento:", error);
    return Promise.reject(error);
  }
};

export {
  searchEvents,
  addNewEvent,
  addNewUser,
  getUserData,
  addEventToFavorites,
  removeEventFromFavorites,
  getEventById,
};
