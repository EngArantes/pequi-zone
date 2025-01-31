import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { db } from "../firebaseConfig";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import "./CreateRadioStation.css";
import { v4 as uuidv4 } from "uuid"; // Para gerar senhas únicas

const CreateRadioStation = ({ onClose, onCreate }) => {
  const { currentUser } = useAuth();
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
      console.log("Verificando se a estação já existe...");
      
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

      console.log("Gerando credenciais exclusivas...");
      
      const streamKey = uuidv4();
      const streamMount = `/radio_${currentUser.uid}.mp3`;
      const serverUrl = "http://meuradio.com"; // Substituir pelo URL correto
      const port = "8000"; // Substituir pela porta correta
      const fullStreamUrl = `${serverUrl}:${port}${streamMount}`;
      
      console.log("Enviando requisição para o backend...");
      
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
        const errorResponse = await response.text();
        console.error("Erro ao adicionar montagem no Icecast:", errorResponse);
        throw new Error("Erro ao adicionar montagem no Icecast");
      }
      
      console.log("Criando nova estação no Firestore...");
      
      const newStation = {
        name: stationName,
        genre: stationGenre,
        userId: currentUser.uid,
        createdAt: new Date(),
        listeners: 0,
        streamMount: streamMount,
        streamKey: streamKey,
        server: serverUrl,
        port: port,
        fullStreamUrl: fullStreamUrl,
      };
      
      const docRef = await addDoc(collection(db, "radioStations"), newStation);
      console.log("Estação criada com ID:", docRef.id);
      
      onCreate({ 
        ...newStation, 
        id: docRef.id 
      });
      
      onClose();
    } catch (err) {
      console.error("Erro ao criar a estação:", err);
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
