import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs, getDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';

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


   // ✅ Adiciona função de edição
   const editProduct = async (updatedProduct) => {
    try {
      const productRef = doc(db, 'produtos', updatedProduct.id);
      await updateDoc(productRef, {
        nome: updatedProduct.nome,
        preco: updatedProduct.preco,
        imagem: updatedProduct.imagem,
      });

      setProducts(prev =>
        prev.map(prod => (prod.id === updatedProduct.id ? updatedProduct : prod))
      );
      console.log(`Produto ${updatedProduct.id} editado com sucesso.`);
    } catch (error) {
      console.error('Erro ao editar produto:', error);
    }
  };


  const deleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, 'produtos', id));
      setProducts(prev => prev.filter(prod => prod.id !== id)); // remove do estado
      console.log(`Produto ${id} deletado com sucesso.`);
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);


  
  

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ products, addProduct, fetchProducts, getProductById, deleteProduct, editProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
