import React from 'react';
import './Home.css';
import Footer from '../Componentes/Footer';
import { Link } from 'react-router-dom';
import HeroImg from '../assets/3dprinter-hero.jpg';
import ProductList from '../Componentes/ProductList'; // <- Importa o card

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero */}
      <section className="hero">
        <div className="hero-text">
          <h1>Transforme Ideias em Objetos Reais</h1>
          <p>Impressão 3D sob medida, com ou sem pintura, qualidade profissional.</p>
        </div>
        <div className="hero-image">
          <img src={HeroImg} alt="Impressora 3D" />
        </div>
      </section>

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
            <h3>📁 Envie seu STL aqui!</h3>
            <p>Tem um modelo próprio? Envie para impressão com cálculo automático.</p>
          </div>
        </Link>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
