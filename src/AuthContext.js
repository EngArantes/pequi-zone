// AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

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

  // Função para registrar um novo usuário
  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
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
      setLoading(false);
    });

    return unsubscribe; // Limpa o observer ao desmontar
  }, []);

  // Valores fornecidos pelo contexto
  const value = {
    currentUser,
    signup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};