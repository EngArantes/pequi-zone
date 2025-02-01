import React from 'react';
import './Home.css';
import Banner_home from '../img/banner_home.jpg';
import Footer from '../Componentes/Footer';
import Player from './RadioPlayer';

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <h1>Dê play</h1>
        <Player/>
      <section className="hero-section">
        <div className="hero-content">
        
          <img src={Banner_home} className='bannerHome' alt='Banner Home' />

          <h1>Bem-vindo ao Pequi Zone</h1>
          <p className="hero-text">
            Crie e compartilhe suas próprias estações de rádio. Transmita sua música, podcasts e muito mais para o mundo!
          </p>

        </div>
      </section>

      {/* Como Funciona Section */}
      <section className="how-it-works">
        <h2>Como Funciona</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-icon">1</div>
            <h3>Crie sua Conta</h3>
            <p>Registre-se gratuitamente e comece a usar o Pequi Zone.</p>
          </div>
          <div className="step">
            <div className="step-icon">2</div>
            <h3>Configure sua Estação</h3>
            <p>Adicione músicas, podcasts e personalize sua estação de rádio.</p>
          </div>
          <div className="step">
            <div className="step-icon">3</div>
            <h3>Compartilhe com o Mundo</h3>
            <p>Transmita sua estação e conquiste ouvintes de todos os lugares.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;