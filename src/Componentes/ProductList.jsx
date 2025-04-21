import React from 'react';
import { useProduct } from '../Contexts/ProductContext';
import ProductCard from './ProductCard';
import './ProductList.css';

const ProductList = () => {
  const { products } = useProduct();

  return (
    <div className="product-list">
      {products && products.length > 0 ? (
        products.map(product => (
          <ProductCard
            key={product.id}
            id={product.id} // <-- isso que faltava
            title={product.nome}
            description={product.descricao}
            price={product.preco}
            imageUrl={product.imagem}
          />

        ))
      ) : (
        <p>Nenhum produto encontrado.</p>
      )}
    </div>
  );
};

export default ProductList;
