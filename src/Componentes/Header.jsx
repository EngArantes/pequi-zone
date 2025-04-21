import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Importando useLocation
import { FaUser, FaSignOutAlt, FaShoppingCart } from 'react-icons/fa';
import './Header.css';
import Logo from '../logo512.png';
import Modal from './ModalLoginRegistro';
import { useAuth } from '../Contexts/AuthContext';
import { useCart } from '../Contexts/CartContext';
import Cart from './Cart';

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { currentUser, logout, isAdmin } = useAuth();
  const { cartItems } = useCart();

  const location = useLocation(); // Hook para pegar o caminho atual

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const handleLogout = () => logout();
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const isActive = (path) => location.pathname === path ? 'active' : ''; // Função para determinar se o link está ativo

  return (
    <>
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo-link">
            <img src={Logo} alt="Logo" className="logo" />
          </Link>

          <nav className="nav">
            <Link to="/" className={`nav-item ${isActive('/')}`}>Home</Link>
            <Link to="/stl-upload" className={`nav-item ${isActive('/stl-upload')}`}>Upload STL</Link>

            {currentUser && isAdmin && <Link to="/dashboard" className={`nav-item ${isActive('/dashboard')}`}>Dashboard</Link>}

            {currentUser ? (
              <button className="icon-button" onClick={handleLogout}>
                <FaSignOutAlt size={20} />
              </button>
            ) : (
              <button className="icon-button" onClick={toggleModal}>
                <FaUser size={20} />
              </button>
            )}

            {/* Carrinho com badge */}
            <button className="icon-button cart-button" onClick={toggleCart}>
              <FaShoppingCart size={20} />
              {cartItems.length > 0 && (
                <span className="cart-badge">{cartItems.length}</span>
              )}
            </button>
          </nav>
        </div>
      </header>

      {isModalOpen && <Modal onClose={toggleModal} />}
      <Cart isOpen={isCartOpen} onClose={toggleCart} />
    </>
  );
};

export default Header;
