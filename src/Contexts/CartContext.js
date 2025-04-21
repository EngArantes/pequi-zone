import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Carrega o carrinho do localStorage
  const loadCartFromLocalStorage = () => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Erro ao carregar carrinho do localStorage:', error);
      return [];
    }
  };

  const [cartItems, setCartItems] = useState(loadCartFromLocalStorage);

  // Adiciona item ao carrinho
  const addToCart = (item) => {
    const itemId = String(item.id);
    const existingItem = cartItems.find(cartItem => String(cartItem.id) === itemId);

    let updatedCart;
    if (existingItem) {
      // Se o item já está no carrinho, aumenta a quantidade
      updatedCart = cartItems.map(cartItem =>
        String(cartItem.id) === itemId
          ? { ...cartItem, quantidade: cartItem.quantidade + 1 }
          : cartItem
      );
    } else {
      // Caso contrário, adiciona o item com quantidade 1
      updatedCart = [...cartItems, { ...item, quantidade: 1 }];
    }

    setCartItems(updatedCart);
  };

  // Remove item do carrinho
  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter(item => String(item.id) !== String(id));
    setCartItems(updatedCart);
  };

  // Atualiza a quantidade de um item
  const updateItemQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      const updatedCart = cartItems.map(item =>
        String(item.id) === String(id)
          ? { ...item, quantidade: quantity }
          : item
      );
      setCartItems(updatedCart);
    }
  };

  // Salva no localStorage sempre que o carrinho mudar
  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Erro ao salvar carrinho no localStorage:', error);
    }
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
