import React, { useState } from "react";
import { useAuth } from "../Contexts/AuthContext";
import "./ModalLoginRegistro.css";
import { FcGoogle } from "react-icons/fc";


const Modal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, signup, loginWithGoogle, loginWithMicrosoft } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (activeTab === "login") {
        await login(email, password);
        onClose();
      } else {
        await signup(email, password);
        onClose();
      }
    } catch (err) {
      setError("Email ou senha inválidos.");
    }
  };


  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      onClose();
    } catch (error) {
      setError("Erro ao entrar com o Google");
    }
  };

  

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="close-btn" onClick={onClose} aria-label="Fechar">×</button>

        <div className="tab-switch">
          <button
            className={activeTab === "login" ? "active" : ""}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={activeTab === "register" ? "active" : ""}
            onClick={() => setActiveTab("register")}
          >
            Registrar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <h2>{activeTab === "login" ? "Entrar na Conta" : "Criar Conta"}</h2>

          <input
            type="email"
            placeholder="Seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="social-login">
            <p className="social-divider">ou continue com</p>
            <button type="button" onClick={handleGoogleLogin} className="social-btn google">
              <FcGoogle size={22} /> Google
            </button>
            
          </div>


          {error && <div className="error-msg">{error}</div>}

          <button type="submit" className="submit-btn">
            {activeTab === "login" ? "Entrar" : "Cadastrar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
