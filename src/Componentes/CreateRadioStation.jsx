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

    // Validação dos campos
    if (!stationName || !stationGenre) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    try {
      console.log("Verificando se a estação já existe...");

      // Verifica se já existe uma estação com o mesmo nome para o usuário atual
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

      // Gera uma chave única para o stream
      const streamKey = uuidv4();

      // Define o mount point (caminho da montagem no Icecast)
      const streamMount = `/radio_${currentUser.uid}.mp3`;

      // Configurações do servidor Icecast
      const serverUrl = "http://localhost"; // Use localhost ou o endereço IP do servidor
      const port = "8000"; // Porta do Icecast
      const fullStreamUrl = `${serverUrl}:${port}${streamMount}`;

      console.log("Enviando requisição para o backend...");

      // Envia uma requisição para criar a montagem no Icecast
      const response = await fetch(
        "https://us-central1-pequi-zone.cloudfunctions.net/api/add-mount",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mountName: streamMount,
            username: currentUser.uid,
            password: streamKey,
          }),
        }
      );

      // Verifica se a requisição foi bem-sucedida
      if (!response.ok) {
        const errorResponse = await response.text();
        console.error("Erro ao adicionar montagem no Icecast:", errorResponse);
        throw new Error("Erro ao adicionar montagem no Icecast");
      }

      console.log("Criando nova estação no Firestore...");

      // Cria o objeto da nova estação
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

      // Adiciona a nova estação ao Firestore
      const docRef = await addDoc(collection(db, "radioStations"), newStation);
      console.log("Estação criada com ID:", docRef.id);

      // Notifica o componente pai sobre a criação da estação
      onCreate({
        ...newStation,
        id: docRef.id,
      });

      // Fecha o modal
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
              required
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
              required
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