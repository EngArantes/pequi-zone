import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Componentes/Header';
import { AuthProvider } from "./AuthContext";
import Home from './Pages/Home';
import Dashboard from './Pages/Dashboard';
import RadioPlayer from './Pages/RadioPlayer';

const App = () => {
  const [currentStreamUrl, setCurrentStreamUrl] = useState(null); // Armazena a URL do stream da estação

  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          {/* Rota para a página inicial (Home) */}
          <Route 
            path="/" 
            element={<Home onPlay={setCurrentStreamUrl} />} // Passa a função para a Home
          />

          {/* Rota para o painel do Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Rota para a página de player de rádio */}
          <Route 
            path="/player" 
            element={<RadioPlayer stationName="Minha Estação de Rádio" streamUrl={currentStreamUrl} />} // Passa a URL para o player
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
