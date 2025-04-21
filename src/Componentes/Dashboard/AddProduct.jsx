import React, { useState } from 'react';
import './AddProduct.css';
import { useProduct } from '../../Contexts/ProductContext';
import { storage } from '../../firebaseConfig'; // Importando a configuração do Firebase Storage
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Importando as funções para upload e para obter a URL

const AddProduct = () => {
  const { addProduct } = useProduct();

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    imagem: '', // URL da imagem principal
    imagensSecundarias: [],
    categoria: '',
    comprimento: '', // Dimensão X (comprimento)
    largura: '', // Dimensão Y (largura)
    altura: '', // Dimensão Z (altura)
  });

  const [imageFile, setImageFile] = useState(null); // Armazenando o arquivo de imagem principal
  const [secondaryImages, setSecondaryImages] = useState([]); // Armazenando os arquivos de imagens secundárias

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]); // Armazenando a imagem principal
  };

  const handleSecondaryImagesChange = (e) => {
    // Permitindo que o campo aceite múltiplos arquivos
    const files = Array.from(e.target.files);
    setSecondaryImages(files); // Atualizando o estado com as imagens selecionadas
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Upload da imagem principal
    let imageUrl = '';
    if (imageFile) {
      const imageRef = ref(storage, `produtos/${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      imageUrl = await getDownloadURL(imageRef); // Obtém a URL da imagem principal
    }

    // Upload das imagens secundárias
    let secondaryImageUrls = [];
    for (let i = 0; i < secondaryImages.length; i++) {
      const file = secondaryImages[i];
      const fileRef = ref(storage, `produtos/secundarias/${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      secondaryImageUrls.push(url); // Adiciona a URL da imagem secundária
    }

    // Adiciona o produto com as URLs das imagens e as dimensões
    const productData = { 
      ...formData, 
      imagem: imageUrl || formData.imagem, 
      imagensSecundarias: secondaryImageUrls,
    };

    await addProduct(productData);

    alert('Produto adicionado com sucesso!');
    setFormData({ nome: '', descricao: '', preco: '', imagem: '', pintado: false, categoria: '', comprimento: '', largura: '', altura: '' });
    setImageFile(null); // Limpa a imagem principal após o upload
    setSecondaryImages([]); // Limpa as imagens secundárias após o upload
  };

  return (
    <div className="add-product-container">
      <h2>Adicionar Novo Produto</h2>
      <form onSubmit={handleSubmit} className="add-product-form">
        <input
          type="text"
          name="nome"
          placeholder="Nome do Produto"
          value={formData.nome}
          onChange={handleChange}
          required
        />
        <textarea
          name="descricao"
          placeholder="Descrição"
          value={formData.descricao}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="preco"
          placeholder="Preço (€)"
          value={formData.preco}
          onChange={handleChange}
          required
        />
        
        {/* Input para o upload da imagem principal */}
        <label>Imagem principal</label>
        <input
          type="file"
          name="imagem"
          accept="image/*,.gif"  /* Aceita imagens e gifs */
          onChange={handleImageChange}
        />

        {/* Input para o upload das imagens secundárias */}
        <label>Imagens secundárias</label>
        <input
          type="file"
          name="imagensSecundarias"
          accept="image/*,.gif"  /* Aceita imagens e gifs */
          multiple
          onChange={handleSecondaryImagesChange}
        />
      

        {/* Campo de Categoria */}
        <select
          name="categoria"
          value={formData.categoria}
          onChange={handleChange}
          required
        >
          <option value="">Selecione a Categoria</option>
          <option value="Decoração">Decoração</option>
          <option value="Funcional">Funcional</option>
          <option value="Acessórios">Acessórios</option>
          <option value="Personalizados">Personalizados</option>
        </select>

        {/* Novos campos para as dimensões do produto */}
        <div className="dimensions-container">
          <input
            type="number"
            name="comprimento"
            placeholder="Comprimento (x)"
            value={formData.comprimento}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="largura"
            placeholder="Largura (y)"
            value={formData.largura}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="altura"
            placeholder="Altura (z)"
            value={formData.altura}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Adicionar</button>
      </form>
    </div>
  );
};

export default AddProduct;
