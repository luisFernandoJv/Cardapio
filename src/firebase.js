// Importe as funções necessárias do Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Adicione o Firestore

// Configuração do Firebase (substitua pelos seus dados)
const firebaseConfig = {
  apiKey: "AIzaSyA6sSwBJU7r35UOmHBNAJ2laMswIfCMMoo",
  authDomain: "bancopostocidade.firebaseapp.com",
  projectId: "bancopostocidade",
  storageBucket: "bancopostocidade.firebasestorage.app",
  messagingSenderId: "975224112046",
  appId: "1:975224112046:web:386cf9e3078fa032033e3f",
  measurementId: "G-X55W788ERG"
};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);

// Inicialize o Firestore
const db = getFirestore(app);

// Exporte o Firestore para uso em outros arquivos
export { db };