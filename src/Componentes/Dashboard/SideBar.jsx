import React from 'react';
import './SideBar.css';

const Sidebar = ({ setView, activeView }) => {
  return (
    <div className="sidebar">
      <h2>Admin</h2>
      <ul>
        <li 
          className={activeView === 'add' ? 'active' : ''}
          onClick={() => setView('add')}
        >
          Add Produto
        </li>
        <li 
          className={activeView === 'listar' ? 'active' : ''}
          onClick={() => setView('listar')}
        >
          Listar Produtos
        </li>
        <li 
          className={activeView === 'pedidos' ? 'active' : ''}
          onClick={() => setView('pedidos')}
        >
          Listar Pedidos
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
