import React from 'react';
import { Link } from 'react-router-dom'; // Importando o Link
import './ProductCard.css';

const ProductCard = ({ id, title, description, price, imageUrl }) => {
  // Formatando o preço
  const formattedPrice = parseFloat(price).toFixed(2);
  const [inteiro, centavos] = formattedPrice.split('.');

  return (
    <div className="product-card">
      <div className="product-image">
        <img
          src={imageUrl || "https://via.placeholder.com/300x200.png?text=Produto+3D"}
          alt={title}
        />
      </div>
      <div className="product-details">
        <h3 className="product-title">{title}</h3>
        {/* Preço formatado */}
        <p className="product-price-card">
          €<span className="price-inteiro">{inteiro}</span><span className="price-centavos">,{centavos}</span>
        </p>
        {/* Usando Link para redirecionar para a página de detalhes do produto */}
        <Link to={`/product/${id}`} className="product-button">
          Ver Detalhes
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
