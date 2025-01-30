// Modal.js
import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import "./ModalLoginRegistro.css";


const Modal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, signup, currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (activeTab === "login") {
      try {
        await login(email, password);
        alert("Login realizado com sucesso!");
        onClose();
      } catch (error) {
        alert("Email/senha incorretos");
      }
    } else {
      try {
        await signup(email, password);
        alert("Registro realizado com sucesso!");
        onClose();
      } catch (error) {
        alert("Erro ao registrar: " + error.message);
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          X
        </button>
        <div className="tab-buttons">
          <button
            onClick={() => setActiveTab("login")}
            className={activeTab === "login" ? "active" : ""}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={activeTab === "register" ? "active" : ""}
          >
            Registrar
          </button>
        </div>
        <div className="tab-content">
          <form onSubmit={handleSubmit}>
            {activeTab === "login" ? (
              <div>
                <h2>Login</h2>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Entrar</button>
              </div>
            ) : (
              <div>
                <h2>Registrar</h2>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Cadastrar</button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Modal;