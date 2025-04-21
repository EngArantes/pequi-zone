import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <div className="footer-container">
      <div className="footer-links">
        <a href="/sobre">Sobre</a>
        <a href="/contato">Contato</a>
        <a href="/termos">Termos</a>
        <a href="/privacidade">Privacidade</a>
      </div>

      <footer className="footer-footer">
        <p>&copy; {new Date().getFullYear()} Pequi3D Print. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default Footer;
