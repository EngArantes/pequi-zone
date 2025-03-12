import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage'; // Importando o Firebase Storage

const firebaseConfig = {
  apiKey: "AIzaSyC6SgiegSgKBNPdLOEBeSLu14Nog-b2A6A",
  authDomain: "pequi-zone.firebaseapp.com",
  projectId: "pequi-zone",
  storageBucket: "pequi-zone.firebasestorage.app",
  messagingSenderId: "958535480922",
  appId: "1:958535480922:web:ae35fb1ba28dfee3714a63"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Habilita persistência offline para Firestore
/* enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.error('Persistência offline falhou devido a múltiplas abas abertas.');
  } else if (err.code === 'unimplemented') {
    console.error('Persistência offline não é suportada no navegador.');
  }
}); */

