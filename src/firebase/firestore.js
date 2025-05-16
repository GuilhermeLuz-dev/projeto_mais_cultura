import { getUserState } from "./auth";
import { db } from "./firebaseConfig";
import {
  getDoc,
  getDocs,
  addDoc,
  deleteDoc,
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
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

// Função que remove um evento.
const removeEvent = async (id) => {
  try {
    const eventDocRef = doc(eventsRef, id);
    await deleteDoc(eventDocRef);
    console.log(`Evento com ID ${id} removido com sucesso.`);
  } catch (error) {
    console.error("Erro ao remover evento:", error);
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
  console.log(data);

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
    return true;
  } catch (error) {
    console.error("Erro ao adicionar evento aos favoritos:", error);
    return false;
  }
};

// Função que edita evento
const eventEdit = async (idEvent, newsDatas) => {
  try {
    const eventDocRef = doc(eventsRef, idEvent);
    await updateDoc(eventDocRef, newsDatas);
    console.log(`Evento ${idEvent} editado com sucesso.`);
    return true;
  } catch (error) {
    console.error("Erro ao editar evento:", error);
    return false;
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
    return true;
  } catch (error) {
    console.error("Erro ao remover evento dos favoritos:", error);
    return false;
  }
};

// Mudando estado do evento para destacado
const highlightingEvent = async (idEvent) => {
  const eventsHighlighting = await searchEvents("emDestaque", true);
  let highlighting = true;
  try {
    eventsHighlighting.forEach((event) => {
      if (event.id == idEvent) {
        highlighting = false;
      }
    });
    const eventDocRef = doc(eventsRef, idEvent);
    await updateDoc(eventDocRef, {
      emDestaque: highlighting,
    });
    if (highlighting) {
      const msg = `Evento adicionado aos destaques com sucesso.`;
      return msg;
    } else {
      const msg = `Evento removido dos destaques com sucesso.`;
      return msg;
    }
  } catch (error) {
    console.error("Erro ao adicionar evento aos destaques:", error);
    const msg = "Erro ao destacar evento";
    return msg;
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
  removeEvent,
  highlightingEvent,
  eventEdit,
};
