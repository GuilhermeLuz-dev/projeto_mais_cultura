import { db } from "./firebaseConfig";
import { getDocs, collection } from "firebase/firestore";

const searchEvents = async () => {
  const querySnapshot = await getDocs(collection(db, "eventos"));
  const data = [];
  querySnapshot.forEach((doc) => {
    data.push(doc.data());
  });

  return data;
};

export { searchEvents };
