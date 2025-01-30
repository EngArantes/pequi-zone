import React, { useState, useEffect, useRef } from "react";
import { FaPlay, FaPause, FaVolumeUp } from "react-icons/fa"; // Ícones para play/pause e volume
import { db } from "../firebaseConfig"; // Supondo que você tenha configurado o Firebase
import "./RadioPlayer.css";

const RadioPlayer = ({ stationName, streamId }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1); // Volume vai de 0 a 1
  const [error, setError] = useState(null); // Estado para erros
  const [streamUrl, setStreamUrl] = useState(""); // URL do stream
  const audioRef = useRef(null); // Ref para controlar o áudio

  // Função para buscar a URL do stream
  const fetchStreamUrl = async () => {
    try {
      const doc = await db.collection("streams").doc(streamId).get(); // Aqui você busca no Firestore
      if (doc.exists) {
        setStreamUrl(doc.data().streamUrl); // Assume que a URL está no campo streamUrl
      } else {
        setError("Estação não encontrada.");
      }
    } catch (err) {
      setError("Erro ao carregar o stream.");
      console.error(err);
    }
  };

  // Função para tocar/pausar o áudio
  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => {
        setError("Erro ao reproduzir o áudio. Verifique a URL.");
        console.error(err);
      });
    }
    setIsPlaying(!isPlaying);
  };

  // Função para ajustar o volume
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  // Carregar a URL do stream quando o componente for montado
  useEffect(() => {
    if (streamId) {
      fetchStreamUrl(); // Recupera a URL do stream quando o ID da estação mudar
    }
  }, [streamId]);

  // Reset do áudio quando a streamUrl muda
  useEffect(() => {
    if (audioRef.current && streamUrl) {
      audioRef.current.pause();
      audioRef.current.load();
      setIsPlaying(false);
      setError(null);
    }
  }, [streamUrl]);

  if (error) {
    return <p>{error}</p>; // Exibe erro caso algo dê errado
  }

  return (
    <div className="radio-player">
      <h2>Estação: {stationName}</h2>
      {streamUrl ? (
        <audio ref={audioRef} src={streamUrl} preload="auto" />
      ) : (
        <p>Carregando o stream...</p> // Mensagem enquanto a URL está sendo carregada
      )}
      <div className="player-controls">
        <button onClick={togglePlayPause} className="play-pause-button">
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <div className="volume-control">
          <label>
            <FaVolumeUp />
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
          />
        </div>
      </div>
    </div>
  );
};

export default RadioPlayer;
