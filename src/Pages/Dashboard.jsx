import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import CreateStationModal from "../Componentes/CreateRadioStation";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import "./Dashboard.css";
import ManageStation from "./ManageStation";
import PlayerRadio from "./RadioPlayer";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [stations, setStations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStationId, setSelectedStationId] = useState(null);
  const [canCreateStation, setCanCreateStation] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    } else {
      fetchStations();
    }
  }, [currentUser, navigate]);

  const fetchStations = async () => {
    if (currentUser) {
      const q = query(collection(db, "radioStations"), where("userId", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);
      const userStations = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStations(userStations);
      setCanCreateStation(userStations.length < 1);
    }
  };


  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openManagePanel = (stationId) => setSelectedStationId(stationId);
  const closeManagePanel = () => setSelectedStationId(null);

  const removeStationFromList = (stationId) => {
    setStations(prevStations => prevStations.filter(station => station.id !== stationId));
  };

  const updateStationInList = (stationId, updatedData) => {
    setStations(prevStations =>
      prevStations.map(station => (station.id === stationId ? { ...station, ...updatedData } : station))
    );
  };

  return (
    <div className="dashboard-container">
      <h1>Bem-vindo, {currentUser?.email}!</h1>
      <p>Aqui estão suas estações de rádio:</p>

      <div className="stations-list">
        {stations.length > 0 ? (
          stations.map((station) => (
            <div key={station.id} className="station-card">
              <h2>{station.name}</h2>
              <p>Gênero: {station.genre}</p>
              <p>Ouvintes: {station.listeners}</p>
              <button className="manage-button" onClick={() => openManagePanel(station.id)}>
                Gerenciar
              </button>
              <PlayerRadio />
            </div>
          ))
        ) : (
          <p>Você ainda não tem estações de rádio.</p>
        )}
      </div>


      {selectedStationId && (
        <ManageStation
          stationId={selectedStationId}
          onClose={closeManagePanel}
          onDelete={removeStationFromList}
          onUpdate={updateStationInList}
        />
      )}

      <button className="create-station-button" onClick={openModal} disabled={!canCreateStation}>
        Criar Nova Estação
      </button>

      <p>Cada usuário pode criar no máximo 2 estações!</p>

      {isModalOpen && <CreateStationModal onClose={closeModal} onCreate={fetchStations} />}
    </div>
  );
};

export default Dashboard;
