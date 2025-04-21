import React, { useState, useEffect } from 'react';
import { storage, db } from '../../firebaseConfig'; // Importe o Firebase e o Firestore
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import './EnviarBannerPrincipal.css';

const EnviarBannerPrincipal = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bannerUrl, setBannerUrl] = useState(null); // Estado para armazenar a URL do banner
  const [bannerFileName, setBannerFileName] = useState(null); // Novo estado para armazenar o nome do arquivo

  // Carregar o banner existente ao carregar o componente
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const bannerRef = doc(db, 'banners', 'principal');
        const bannerDoc = await getDoc(bannerRef);
        if (bannerDoc.exists()) {
          const data = bannerDoc.data();
          setBannerUrl(data.imageUrl);
          // Extrair o nome do arquivo da URL ao carregar o banner
          const fileName = decodeURIComponent(
            data.imageUrl.split('/o/')[1].split('?')[0].split('%2F')[1]
          );
          setBannerFileName(fileName);
        }
      } catch (error) {
        console.error('Erro ao carregar o banner:', error);
      }
    };

    fetchBanner();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleUpload = async () => {
    if (!image) return;
    setLoading(true);

    // Verificar se já existe um banner e excluir o anterior se necessário
    if (bannerUrl && bannerFileName) {
      try {
        // Excluir a imagem anterior do Firebase Storage
        const bannerRef = ref(storage, `banners/${bannerFileName}`);
        await deleteObject(bannerRef);
      } catch (error) {
       
      }
    }

    // Referência para o Firebase Storage
    const bannerRef = ref(storage, `banners/${image.name}`);

    try {
      // Faz o upload da nova imagem para o Firebase Storage
      const snapshot = await uploadBytes(bannerRef, image);
      // Obtém a URL da imagem após o upload
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Salva a URL e o nome do arquivo no Firestore
      await setDoc(doc(db, 'banners', 'principal'), {
        imageUrl: downloadURL,
        fileName: image.name, // Salva o nome do arquivo no Firestore
        createdAt: new Date(),
      });

      setBannerUrl(downloadURL); // Atualiza a URL do banner no estado
      setBannerFileName(image.name); // Atualiza o nome do arquivo no estado
      setImage(null); // Limpa o input de arquivo
      alert('Banner enviado com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar imagem:', error);
      alert('Falha no envio do banner');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBanner = async () => {
    if (!bannerUrl || !bannerFileName) return;

    try {
      // Excluir o banner do Firebase Storage usando o nome do arquivo
      const bannerRef = ref(storage, `banners/${bannerFileName}`);
      await deleteObject(bannerRef);
      console.log('Banner excluído do Firebase Storage com sucesso!');

      // Excluir o banner do Firestore
      await deleteDoc(doc(db, 'banners', 'principal'));
      console.log('Banner excluído do Firestore com sucesso!');

      setBannerUrl(null); // Limpar a URL do banner no estado
      setBannerFileName(null); // Limpar o nome do arquivo no estado
      alert('Banner excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir o banner:', error);
      alert('Falha ao excluir o banner');
    }
  };

  return (
    <div className="banner-upload-container">
      <h2>Enviar Banner Principal</h2>
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'Enviando...' : 'Enviar Banner'}
      </button>

      {/* Exibir o banner atual em miniatura */}
      {bannerUrl && (
        <div className="banner-preview-container">
          <h3>Banner Atual</h3>
          <img src={bannerUrl} alt="Banner Principal" className="banner-thumbnail" />
          <button onClick={handleDeleteBanner} className="delete-banner-button">
            Excluir Banner
          </button>
        </div>
      )}
    </div>
  );
};

export default EnviarBannerPrincipal;