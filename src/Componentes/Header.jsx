import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaSignOutAlt } from 'react-icons/fa'; // Importe o ícone de logout
import './Header.css';
import Logo from '../logo512.png';
import Modal from './ModalLoginRegistro';
import { useAuth } from '../AuthContext'; // Importe o contexto de autenticação

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentUser, logout } = useAuth(); // Use o contexto de autenticação

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleLogout = () => {
    logout(); // Função de logout do contexto
  };

  return (
    <header className="header-container">
      <div className='logo-container'>
        <img className="logomarcaHeader" src={Logo} alt="Logomarca" />
      </div>
      <nav className="nav-links">
        <Link to="/" className="nav-item">Home</Link>
        {currentUser ? (
        <Link to="/dashboard" className="nav-item">Dashboard</Link>
        ) : null}
        {currentUser ? (
          // Se o usuário estiver logado, exibe o ícone de logout
          <button className="nav-item icon-button" onClick={handleLogout}>
            <FaSignOutAlt size={20} />
          </button>
        ) : (
          // Se o usuário não estiver logado, exibe o ícone de login
          <button className="nav-item icon-button" onClick={toggleModal}>
            <FaUser size={20} />
          </button>
        )}
      </nav>
      {isModalOpen && <Modal onClose={toggleModal} />}
    </header>
  );
};

export default Header;