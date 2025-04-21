import React from 'react';
import { useCart } from '../Contexts/CartContext';
import './AddToCartButton.css';

const AddToCartButton = ({ product }) => {
  const { addToCart } = useCart();

  const handleAdd = () => {
    // Verifica se o produto tem ID e preço válidos
    

    const preco = parseFloat(product.preco);
    if (isNaN(preco)) {
      alert("Preço inválido.");
      return;
    }

    // Cria o item com dados válidos
    const item = {
      id: product.id,
      nome: product.nome || 'Produto sem nome',
      imagem: product.imagem || 'https://via.placeholder.com/100x100.png?text=Sem+Imagem',
      preco: preco,
    };
    addToCart(item);
  };

  return (
    <button className="add-to-cart" onClick={handleAdd}>
      Adicionar ao Carrinho
    </button>
  );
};

export default AddToCartButton;
