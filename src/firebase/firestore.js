import { db } from "./firebaseConfig";
import { getDocs, addDoc, collection, query, where } from "firebase/firestore";

const eventsRef = collection(db, "eventos");

const searchEvents = async () => {
  const querySnapshot = await getDocs(eventsRef);
  const data = [];
  querySnapshot.forEach((doc) => {
    data.push(doc.data());
  });

  return data;
};

const searchEventsByCategory = async (category) => {
  const q = query(eventsRef, where("categoria", "==", category));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    console.log(doc.data());
  });
};

const addNewEvent = async (event) => {
  try {
    const docRef = await addDoc(eventsRef, event);
    console.log(`Novo evento adicionado com sucesso: ${docRef.id}`);
  } catch (error) {
    console.error(error);
  }
};

export { searchEvents, searchEventsByCategory, addNewEvent };
