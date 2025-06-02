import React, { useState, useEffect } from 'react';
import './ModalEditProduct.css';

const ModalEditarProduto = ({ produto, onClose, onSave }) => {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [imagemPreview, setImagemPreview] = useState('');
  const [imagemFile, setImagemFile] = useState(null);

  useEffect(() => {
    if (produto) {
      setNome(produto.nome);
      setPreco(produto.preco);
      setImagemPreview(produto.imagem); // URL atual
    }
  }, [produto]);

  if (!produto) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedProduct = {
      id: produto.id,
      nome,
      preco,
      imagem: imagemPreview,
      imagemFile, // Enviar file se for necessário salvar no Firebase
    };

    onSave(updatedProduct);
    onClose();
  };

  const handleImagemChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagemFile(file);
      setImagemPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>Editar Produto</h3>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Nome do Produto</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Preço (€)</label>
            <input type="number" step="0.01" value={preco} onChange={(e) => setPreco(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Imagem</label>
            <input type="file" accept="image/*" onChange={handleImagemChange} />
          </div>

          {imagemPreview && (
            <div className="imagem-preview">
              <img src={imagemPreview} alt="Preview do produto" />
            </div>
          )}

          <div className="modal-buttons">
            <button type="submit" className="btn-primary">Salvar</button>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarProduto;
