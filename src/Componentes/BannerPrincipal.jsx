import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig'; // Importe o Firestore
import { doc, getDoc } from 'firebase/firestore';
import './BannerPrincipal.css'

const BannerPrincipal = () => {
  const [bannerUrl, setBannerUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Recupera o banner principal do Firestore
    const fetchBanner = async () => {
      try {
        const docRef = doc(db, 'banners', 'principal');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setBannerUrl(docSnap.data().imageUrl); // Salva a URL do banner
        } else {
          console.log('Nenhum banner encontrado');
        }
      } catch (error) {
        console.error('Erro ao recuperar o banner:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, []);

  return (
         
        <div className="hero-image">
          {loading ? (
            <p>Carregando banner...</p>
          ) : bannerUrl ? (
            <img className='banner-principal-image' src={bannerUrl} alt="Impressora 3D" />
          ) : (
            <p></p>
          )}
        </div>   
    
  );
};

export default BannerPrincipal;
