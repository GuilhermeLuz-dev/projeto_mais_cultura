import { db } from "./firebaseConfig";
import { getDocs, collection } from "firebase/firestore";

const searchEvents = async () => {
  const querySnapshot = await getDocs(collection(db, "Eventos"));

  querySnapshot.forEach((doc) => {
    console.log(`id: ${doc.id} => ${doc.data().titulo}`);
  });
};

searchEvents();
