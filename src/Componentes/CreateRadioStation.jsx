import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { db } from "../firebaseConfig";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import "./CreateRadioStation.css";
import { v4 as uuidv4 } from "uuid"; // Para gerar senhas únicas

const CreateRadioStation = ({ onClose, onCreate }) => {
  const { currentUser } = useAuth(); // Obtém o usuário autenticado
  const [stationName, setStationName] = useState("");
  const [stationGenre, setStationGenre] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    if (!stationName || !stationGenre) {
      setError("Por favor, preencha todos os campos.");
      return;
    }
  
    try {
      // Verifica se já existe uma estação com o mesmo nome e usuário
      const stationsQuery = query(
        collection(db, "radioStations"),
        where("userId", "==", currentUser.uid),
        where("name", "==", stationName)
      );
      const querySnapshot = await getDocs(stationsQuery);
  
      if (!querySnapshot.empty) {
        setError("Você já tem uma estação com esse nome.");
        return;
      }
  
      // Gerando credenciais exclusivas
      const streamKey = uuidv4();
      const streamMount = `/radio_${currentUser.uid}.mp3`;
  
      // Adiciona a montagem no Icecast
      const response = await fetch("https://us-central1-pequi-zone.cloudfunctions.net/api/add-mount", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mountName: streamMount,
          username: currentUser.uid,
          password: streamKey,
        }),
      });
      
  
      if (!response.ok) {
        throw new Error("Erro ao adicionar montagem no Icecast");
      }
  
      // Criação da nova estação na base de dados
      const newStation = {
        name: stationName,
        genre: stationGenre,
        userId: currentUser.uid,
        createdAt: new Date(),
        listeners: 0,
        streamMount: streamMount,
        streamKey: streamKey,
      };
  
      // Adiciona a estação no Firestore
      const docRef = await addDoc(collection(db, "radioStations"), newStation);
  
      // Chama a função onCreate passando a nova estação com seu ID
      onCreate({ 
        ...newStation, 
        id: docRef.id 
      });
  
      // Fecha o modal após a criação
      onClose();
    } catch (err) {
      setError("Erro ao criar a estação. Tente novamente.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          X
        </button>
        <h2>Criar Nova Estação</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="stationName">Nome da Estação:</label>
            <input
              type="text"
              id="stationName"
              value={stationName}
              onChange={(e) => setStationName(e.target.value)}
              placeholder="Digite o nome da estação"
            />
          </div>
          <div className="form-group">
            <label htmlFor="stationGenre">Gênero Musical:</label>
            <input
              type="text"
              id="stationGenre"
              value={stationGenre}
              onChange={(e) => setStationGenre(e.target.value)}
              placeholder="Digite o gênero musical"
            />
          </div>
          <button type="submit" className="submit-button">
            Criar Estação
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRadioStation;