import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import "./ManageStation.css";

const ManageStation = ({ stationId, onClose, onDelete, onUpdate }) => {
  const [station, setStation] = useState(null);
  const [newName, setNewName] = useState("");
  const [newGenre, setNewGenre] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStationData = async () => {
      try {
        setLoading(true); // Inicia o carregamento
        const stationDoc = await getDoc(doc(db, "radioStations", stationId));
        
        if (stationDoc.exists()) {
          const stationData = stationDoc.data();
          setStation(stationData);
          setNewName(stationData.name);
          setNewGenre(stationData.genre);
        } else {
          setError("Estação não encontrada.");
        }
      } catch (err) {
        setError("Erro ao carregar dados da estação.");
        console.error(err);
      } finally {
        setLoading(false); // Finaliza o carregamento
      }
    };

    if (stationId) {
      fetchStationData();
    }
  }, [stationId]);

  const handleUpdate = async () => {
    try {
      const stationRef = doc(db, "radioStations", stationId);
      await updateDoc(stationRef, {
        name: newName,
        genre: newGenre,
      });

      // Atualiza os dados localmente
      const updatedStation = {
        id: stationId,
        name: newName,
        genre: newGenre,
      };

      // Chama a função onUpdate passada pelo Dashboard
      onUpdate(stationId, updatedStation);

      // Fechar o modal após a atualização
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar estação: ", error);
      setError("Erro ao salvar as alterações.");
    }
  };

  const handleDeleteConfirmation = () => {
    const confirmation = window.confirm("Tem certeza de que deseja excluir esta estação?");
    if (confirmation) {
      handleDelete();
    }
  };

  const handleDelete = async () => {
    try {
      const stationRef = doc(db, "radioStations", stationId);
      await deleteDoc(stationRef);
      onDelete(stationId); // Remove a estação da lista no painel
      onClose(); // Fecha o modal após a exclusão
    } catch (error) {
      console.error("Erro ao excluir estação: ", error);
      setError("Erro ao excluir a estação.");
    }
  };

  if (loading) {
    return <p>Carregando estação...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="manage-station-container">
      <h2>Gerenciar Estação: {station.name}</h2>
      <div>
        <label>
          Nome da Estação:
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Gênero:
          <input
            type="text"
            value={newGenre}
            onChange={(e) => setNewGenre(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Stream Key:
          <input
            type="text"
            value={station.streamKey}
            readOnly
          />
        </label>
      </div>
      <div>
        <label>
          Stream Mount:
          <input
            type="text"
            value={station.streamMount}
            readOnly
          />
        </label>
      </div>
      <div>
        <label>
          IP:
          <input
            type="text"
            value={station.ip}
            readOnly
          />
        </label>
      </div>
      <div>
        <label>
          Porta:
          <input
            type="text"
            value={station.port}
            readOnly
          />
        </label>
      </div>
      <div>
        <label>
          Senha:
          <input
            type="text"
            value={station.password}
            readOnly
          />
        </label>
      </div>
      <button onClick={handleUpdate} className="buttonSalvar">
        Salvar mudanças
      </button>
      <button onClick={handleDeleteConfirmation} className="buttonExcluir">
        Excluir Estação
      </button>
      <button onClick={onClose} className="buttonFechar">
        Fechar
      </button>
    </div>
  );
};

export default ManageStation;
