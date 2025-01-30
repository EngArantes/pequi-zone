const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const app = express();

// Permitir JSON no corpo das requisições
app.use(express.json());

// Configurar CORS corretamente
app.use(cors({origin: "https://pequi-zone.web.app"}));

// Rota para adicionar uma montagem no Icecast
app.post("/add-mount", async (req, res) => {
  try {
    const {mountName, username, password} = req.body;

    if (!mountName || !username || !password) {
      return res.status(400).json({error: "Dados inválidos"});
    }

    // Aqui você pode chamar o Icecast ou salvar no Firestore

    res.status(200).json({message: "Montagem adicionada com sucesso!"});
  } catch (error) {
    res.status(500).json({error: "Erro no servidor"});
  }
});

// Exportando a API para o Firebase Functions
exports.api = functions.https.onRequest(app);
