import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Cria o contexto
const AuthContext = createContext();

// Hook personalizado para usar o contexto
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provedor do contexto
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Função para registrar um novo usuário
  const signup = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
  
    // Cria um documento no Firestore com isAdmin: false
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      isAdmin: false,
      createdAt: new Date()
    });
  
    return userCredential;
  };

  // Função para fazer login
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Função para fazer logout
  const logout = () => {
    return signOut(auth);
  };

  // Observa mudanças no estado de autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false); // Mudei aqui para garantir que a flag de loading seja atualizada
    });

    return unsubscribe;
  }, []);

  // Verifica se o usuário é admin após a autenticação
  useEffect(() => {
    const checkAdmin = async () => {
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setIsAdmin(docSnap.data().isAdmin);
        }
      }
    };
  
    checkAdmin();
  }, [currentUser]);

  // Login com Google
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
  
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
  
    if (!userSnap.exists()) {
      // Primeira vez logando com Google, adiciona ao Firestore
      await setDoc(userRef, {
        email: user.email,
        isAdmin: false,
        createdAt: new Date()
      });
    }
  };
  
  // Valores fornecidos pelo contexto
  const value = {
    currentUser,
    isAdmin, // Adicionei o isAdmin aqui para ser acessível nos componentes
    signup,
    login,
    logout,
    loginWithGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
