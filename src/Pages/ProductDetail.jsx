import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import './ProductDetail.css';
import AddToCartButton from '../Componentes/AddToCartButton';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [thumbIndex, setThumbIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, 'produtos', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setProduct({ ...data, id: docSnap.id }); // <- Aqui adicionamos o ID ao produto

        setActiveImage(data.imagem);
      } else {
        console.log('Produto não encontrado');
      }
    };

    fetchProduct();
  }, [id]);


  if (!product) return <div className="loading">Carregando...</div>;

  // Formatando o preço
  const formattedPrice = parseFloat(product.preco).toFixed(2);
  const [inteiro, centavos] = formattedPrice.split('.');

  // Organizando as imagens
  const allImages = [product.imagem, ...(product.imagensSecundarias || [])];
  const visibleThumbs = allImages.slice(thumbIndex, thumbIndex + 4); // Mostra 4 imagens por vez

  const handlePrev = () => {
    setThumbIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setThumbIndex((prev) => Math.min(prev + 1, allImages.length - 4));
  };

  // Função para abrir o modal
  const openModal = (image) => {
    setActiveImage(image);
    setIsModalOpen(true);
  };

  // Função para fechar o modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Função para navegar entre as imagens no modal
  const handlePrevImage = () => {
    const currentIndex = allImages.indexOf(activeImage);
    const prevIndex = (currentIndex === 0) ? allImages.length - 1 : currentIndex - 1;
    setActiveImage(allImages[prevIndex]);
  };

  const handleNextImage = () => {
    const currentIndex = allImages.indexOf(activeImage);
    const nextIndex = (currentIndex === allImages.length - 1) ? 0 : currentIndex + 1;
    setActiveImage(allImages[nextIndex]);
  };

  return (
    <div className="product-detail-wrapper">
      <div className="product-detail-card">
        {/* Seção de Imagens */}
        <div className="image-section">
          <div className="main-image-container">
            <img
              src={activeImage}
              alt={product.nome}
              className="main-image"
              onClick={() => openModal(activeImage)} // Abrir imagem no modal
            />
          </div>

          {/* Carrossel de Imagens */}
          <div className="carousel-wrapper">
            <button
              className="carousel-arrow left"
              onClick={handlePrev}
              disabled={thumbIndex === 0}
            >
              ‹
            </button>

            <div className="thumbnail-row">
              {visibleThumbs.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`thumb-${idx}`}
                  className={`thumb ${activeImage === url ? 'active' : ''}`}
                  onClick={() => setActiveImage(url)}
                />
              ))}
            </div>

            <button
              className="carousel-arrow right"
              onClick={handleNext}
              disabled={thumbIndex + 4 >= allImages.length}
            >
              ›
            </button>
          </div>
        </div>

        {/* Seção de Detalhes do Produto */}
        <div className="details-section">
          <p className="product-category"><strong>Categoria: </strong>{product.categoria}</p>
          <h1>{product.nome}</h1>

          {/* Preço formatado */}
          <p className="product-price">
            €<span className="price-inteiro">{inteiro}</span><span className="price-centavos">,{centavos}</span>
          </p>


          <AddToCartButton product={product} />


          {/* Etiqueta de "Com Pintura" */}
          {product.pintado && <span className="badge">Com pintura</span>}
        </div>

        <div className='product-description'>
          <h2 className='titulo_descricao'>Descrição</h2>
          {/* Exibindo as dimensões (cm) do produto */}
          <p className="product-dimensions">
            <strong>Dimensões:</strong> {product.comprimento} x {product.largura} x {product.altura} cm
          </p>
          <p>{product.descricao}</p>
        </div>
      </div>

      {/* Modal para exibir a imagem maior */}
      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="carousel-arrow left" onClick={handlePrevImage}>‹</button>
            <img src={activeImage} alt="Imagem maior" className="modal-image" />
            <button className="carousel-arrow right" onClick={handleNextImage}>›</button>
            <button className="close-button" onClick={closeModal}>X</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
