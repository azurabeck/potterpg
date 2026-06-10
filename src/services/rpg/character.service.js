// src/services/rpg/character.service.js

import {
   collection,
   query,
   where,
   getDocs,
   addDoc,
   serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export const getCharactersByUserId = async (user_id) => {
   const charactersRef = collection(db, "characters");

   const characterQuery = query(
      charactersRef,
      where("user_id", "==", user_id)
   );

   const snapshot = await getDocs(characterQuery);

   return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
   }));
};

export const createCharacter = async ({ user_id, character }) => {
   const charactersRef = collection(db, "characters");

   const docRef = await addDoc(charactersRef, {
      ...character,
      user_id: user_id,
      habilidades: {},
      pocoes: {},
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
   });

   return docRef.id;
};