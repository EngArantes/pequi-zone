import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { db } from "../firebaseConfig";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import "./CreateRadioStation.css";
import { v4 as uuidv4 } from "uuid";

const CreateRadioStation = ({ onClose, onCreate }) => {
  const { currentUser } = useAuth();
  const [stationName, setStationName] = useState("");
  const [stationGenre, setStationGenre] = useState("");
  const [error, setError] = useState("");
  const [stationCreated, setStationCreated] = useState(null);

  const projectId = "pequi-zone"; // Do seu firebaseConfig
  const region = "us-central1"; // Ajuste se usar outra região
  const isLocal = window.location.hostname === "localhost";
  const baseUrl = isLocal
    ? `http://localhost:5001/${projectId}/${region}`
    : `https://${region}-${projectId}.cloudfunctions.net`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!stationName || !stationGenre) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    try {
      // Verifica se já existe uma estação com o mesmo nome para o mesmo usuário
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

      // Geração de streamKey única
      const streamKey = uuidv4();
      const streamMount = `/stream_${currentUser.uid}_${stationName.replace(/\s+/g, "_")}`;

      // Informações da estação de rádio
      const newStation = {
        name: stationName,
        genre: stationGenre,
        userId: currentUser.uid,
        createdAt: new Date(),
        listeners: 0,
        streamMount: streamMount,
        streamKey: streamKey,
        uploadUrl: `${baseUrl}/uploadStream${streamMount}`,  // URL para upload (POST)
        listenUrl: `${baseUrl}/listenStream${streamMount}`,  // URL para os ouvintes (GET)
        isLive: false,
      };

      // Salva a estação no Firestore
      const docRef = await addDoc(collection(db, "radioStations"), newStation);

      const createdStation = {
        ...newStation,
        id: docRef.id,
      };

      // Exibe o sucesso na criação da estação
      setStationCreated(createdStation);
      onCreate(createdStation);
    } catch (err) {
      setError("Erro ao criar a estação. Tente novamente.");
      console.error(err);
    }
  };

  if (stationCreated) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="close-button" onClick={onClose}>
            X
          </button>
          <h2>Estação Criada com Sucesso!</h2>
          <p>Aqui estão os detalhes para configurar sua transmissão:</p>
          <div className="station-details">
            <h3>{stationCreated.name}</h3>
            <p><strong>Gênero:</strong> {stationCreated.genre}</p>
            <p><strong>URL de Transmissão (RadioBOSS):</strong></p>
            <pre>{stationCreated.uploadUrl}</pre>
            <p><strong>Stream Key:</strong> {stationCreated.streamKey}</p>
            <p><strong>URL para Ouvintes:</strong></p>
            <pre>{stationCreated.listenUrl}</pre>
            <p>Use essas informações no RadioBOSS. Método: POST, Formato: MP3.</p>
          </div>
          <button className="submit-button" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    );
  }

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
