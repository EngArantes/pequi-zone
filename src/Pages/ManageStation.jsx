import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import "./ManageStation.css";

const serverUrl = "http://192.168.1.128:8000"; // Substitua pelo IP ou domínio do seu Icecast

const ManageStation = ({ stationId, onClose, onDelete, onUpdate }) => {
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStationData = async () => {
      try {
        const stationDoc = await getDoc(doc(db, "radioStations", stationId));
        if (stationDoc.exists()) {
          setStation(stationDoc.data());
        } else {
          console.error("Estação não encontrada.");
        }
      } catch (error) {
        console.error("Erro ao buscar estação:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStationData();
  }, [stationId]);

  const handleUpdate = async () => {
    if (!station) return;

    try {
      const stationRef = doc(db, "radioStations", stationId);
      await updateDoc(stationRef, {
        name: station.name,
        genre: station.genre,
      });

      onUpdate(stationId, { ...station });
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar estação: ", error);
    }
  };

  const handleDeleteConfirmation = () => {
    if (window.confirm("Tem certeza de que deseja excluir esta estação?")) {
      handleDelete();
    }
  };

  const handleDelete = async () => {
    try {
      const stationRef = doc(db, "radioStations", stationId);
      await deleteDoc(stationRef);
      onDelete(stationId);
      onClose();
    } catch (error) {
      console.error("Erro ao excluir estação: ", error);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copiado para a área de transferência!");
  };

  if (loading) return <p>Carregando estação...</p>;
  if (!station) return <p>Erro ao carregar estação.</p>;

  return (
    <div className="manage-station-container">
      <h2>Gerenciar Estação: {station.name}</h2>

      <div>
        <label>
          Nome da Estação:
          <input
            type="text"
            value={station.name}
            onChange={(e) => setStation({ ...station, name: e.target.value })}
          />
        </label>
      </div>

      <div>
        <label>
          Gênero:
          <input
            type="text"
            value={station.genre}
            onChange={(e) => setStation({ ...station, genre: e.target.value })}
          />
        </label>
      </div>

      <div className="copy-container">
        <label>Servidor Icecast:  
          <button className="botaoCopiar" onClick={() => copyToClipboard(serverUrl)}>Copiar</button>
        </label>
        <input type="text" value={serverUrl} readOnly />
      </div>

      <div className="copy-container">
        <label>Stream Mount: 
        <button className="botaoCopiar" onClick={() => copyToClipboard(station.streamMount)}>Copiar</button>
        </label>
        <input type="text" value={station.streamMount} readOnly />
      </div>

      <div className="copy-container">
        <label>Stream Key (Senha):
        <button className="botaoCopiar" onClick={() => copyToClipboard(station.streamKey)}>Copiar</button>
        </label>
        <input type="text" value={station.streamKey} readOnly />
      </div>

      <div className="copy-container">
        <label>URL Completa de Transmissão:
        <button className="botaoCopiar" onClick={() => copyToClipboard(`${serverUrl}${station.streamMount}`)}>Copiar</button>
        </label>
        <input type="text" value={`${serverUrl}${station.streamMount}`} readOnly />
      </div>

      <button onClick={handleUpdate} className="buttonSalvar">Salvar mudanças</button>
      <button onClick={handleDeleteConfirmation} className="buttonExcluir">Excluir Estação</button>
      <button onClick={onClose} className="buttonFechar">Fechar</button>
    </div>
  );
};

export default ManageStation;
