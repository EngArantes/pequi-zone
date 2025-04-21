import React from 'react';
import './Home.css';
import Footer from '../Componentes/Footer';
import { Link } from 'react-router-dom';
import ProductList from '../Componentes/ProductList'; // <- Importa o card
import BannerPrincipal from '../Componentes/BannerPrincipal';

const Home = () => {
  return (
    <div className="home-container">
      <div className='container-banner-principal'>
        <BannerPrincipal />
      </div>

      {/* Seção de Produtos em Destaque */}
      <section className="product-showcase">
        <h2>Produtos em Destaque</h2>
        <div className="product-grid">
          <ProductList />
        </div>
      </section>

      {/* Seções de Destaque */}
      <section className="features">
        <Link to="/stl-upload" className="text-stl">
          <div className="feature-box">
            <h1 className='icon-pasta'>📁</h1> <h3>Envie seu STL aqui!</h3>
            <p>Tem um modelo próprio? Envie para impressão com cálculo automático.</p>
          </div>
        </Link>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
