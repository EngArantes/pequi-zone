import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './Componentes/Header';
import { AuthProvider, useAuth } from './Contexts/AuthContext'; // Importa o contexto de autenticação
import { ProductProvider } from './Contexts/ProductContext'; // Importa o contexto de produto
import Home from './Pages/Home';
import Dashboard from './Pages/Dashboard';
import ProductDetail from './Pages/ProductDetail';
import STLUploadForm from './Pages/STLuploadForm';
import { CartProvider } from './Contexts/CartContext';

const App = () => {
  const [currentStreamUrl, setCurrentStreamUrl] = useState(null);

  return (
    <AuthProvider>
      <ProductProvider>
      <CartProvider>
        <Router>
          <Header />
          <Routes>
            <Route
              path="/"
              element={<Home/>}
            />
            <Route
              path="/dashboard"
              element={<PrivateRoute />}
            />
            <Route
              path="/product/:id"
              element={<ProductDetail />}
            />
            <Route
              path="/stl-upload"
              element={<STLUploadForm />}
            />
          </Routes>
        </Router>
       </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
};

const PrivateRoute = () => {
  const { currentUser, isAdmin } = useAuth();

  if (!currentUser) {
    // Se não estiver autenticado, redireciona para a home
    return <Navigate to="/" />;
  }

  if (!isAdmin) {
    // Se o usuário não for admin, redireciona para a home (ou outra página)
    return <Navigate to="/" />;
  }

  // Se o usuário for admin, permite o acesso ao Dashboard
  return <Dashboard />;
};

export default App;
