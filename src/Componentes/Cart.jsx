import React from 'react';
import './Cart.css';
import { useCart } from '../Contexts/CartContext';
import { FaTimes } from 'react-icons/fa';

const Cart = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateItemQuantity } = useCart();

  return (
    <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
      <div className="cart-header">
        <h3>Seu Carrinho</h3>
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>
      </div>
      <div className="cart-content">
        {cartItems.length === 0 ? (
          <p>O carrinho está vazio.</p>
        ) : (
          <ul className="cart-items-list">
            {cartItems.map((item) => (
              <li key={`${item.id}-${item.nome}`} className="cart-item">
                <img src={item.imagem} alt={item.nome} className="cart-thumb" />
                <div className="item-info">
                  <p className="item-name">{item.nome}</p>
                  <p className="item-price">€ {item.preco.toFixed(2)}</p>
                  <div className="quantity-control">
                    <button
                      onClick={() => updateItemQuantity(item.id, item.quantidade - 1)}
                      disabled={item.quantidade <= 1} // Desativa o botão se quantidade for 1
                    >
                      -
                    </button>
                    <span>{item.quantidade}</span>
                    <button
                      onClick={() => updateItemQuantity(item.id, item.quantidade + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  className="remove-button"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="cart-footer">
        <button className="checkout-button">Finalizar Compra</button>
      </div>
    </div>
  );
};

export default Cart;