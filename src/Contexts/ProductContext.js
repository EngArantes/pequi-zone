import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs, getDoc, doc } from 'firebase/firestore';

const ProductContext = createContext();

export const useProduct = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, 'produtos'));
    const produtos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProducts(produtos);
  };

  const addProduct = async (product) => {
    const docRef = await addDoc(collection(db, 'produtos'), product);
    const newProduct = { id: docRef.id, ...product };
    setProducts(prev => [...prev, newProduct]); // Atualiza localmente sem re-fetch
    return docRef.id;
  };

  const getProductById = async (id) => {
    const docSnap = await getDoc(doc(db, 'produtos', id));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  };
  
  

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ products, addProduct, fetchProducts, getProductById }}>
      {children}
    </ProductContext.Provider>
  );
};
