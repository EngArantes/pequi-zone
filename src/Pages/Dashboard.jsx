import React, { useState } from "react"; // Importando useState daqui!
import AddProduct from "../Componentes/Dashboard/AddProduct";
import ListarProdutos from "../Componentes/Dashboard/ListarProdutos";
import Sidebar from "../Componentes/Dashboard/SideBar";
import "./Dashboard.css";

const Dashboard = () => {
  const [view, setView] = useState('add');

  const renderView = () => {
    switch (view) {
      case 'add':
        return <AddProduct />;
      case 'listar':
        return <ListarProdutos />;
      case 'pedidos':
        return <div>Listar Pedidos (em breve)</div>;
      default:
        return <div>Escolha uma opção no menu.</div>;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Aqui é onde você precisa garantir que está passando o activeView */}
      <Sidebar setView={setView} activeView={view} />
      <div className="dashboard-content">
        {renderView()}
      </div>
    </div>
  );
};

export default Dashboard;
