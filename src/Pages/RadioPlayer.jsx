import React, { useState, useRef, useEffect } from "react";
import { FaPlay, FaPause, FaVolumeUp } from "react-icons/fa"; // Ícones para play/pause e volume
import "./RadioPlayer.css";

const RadioPlayer = ({ stationName, streamUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1); // Volume vai de 0 a 1
  const [error, setError] = useState(null); // Estado para erros
  const audioRef = useRef(null); // Ref para controlar o áudio
  streamUrl = "http://127.0.0.1:8000/radio_PO441d28UeYUwiYn94SNLDvlGd12.mp3";
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

  // Reset do áudio quando a streamUrl muda
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      setIsPlaying(false);
      setError(null);
    }
  }, [streamUrl]);

  return (
    <div className="radio-player">
      <h2>Estação: {stationName}</h2>
      <audio ref={audioRef} src={streamUrl} preload="auto" />
      {error && <p className="error-message">{error}</p>}
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