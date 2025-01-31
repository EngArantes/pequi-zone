const functions = require("firebase-functions");
const axios = require("axios"); // Use axios para fazer requisição HTTP
const express = require("express");
const cors = require("cors");
const app = express();

// Configuração do CORS
app.use(cors({origin: ["https://pequi-zone.web.app", "http://localhost:3003"]}));
app.use(express.json()); // Permitir JSON no corpo das requisições

// Defina as credenciais do Icecast (alterar conforme necessário)
const icecastUrl = "http://localhost:8000/admin/"; // URL do Icecast
const username = "admin"; // Nome de usuário de admin do Icecast
const password = "D102030"; // Senha de admin do Icecast

// Função para adicionar uma nova montagem ao Icecast
const addMountToIcecast = async (mountName, streamKey) => {
  try {
    // Parâmetros de requisição para o Icecast (alterar conforme necessidade)
    const response = await axios.post(`${icecastUrl}mounts`, {
      mount_name: mountName, // Nome da montagem
      password: password, // Senha de acesso do Icecast
      public: 1, // Tornar público (dependendo da configuração do seu Icecast)
      stream_key: streamKey, // A chave do stream (se aplicável)
    }, {
      auth: {
        username: username,
        password: password, // Autenticação básica
      },
    });

    console.log("Montagem criada com sucesso:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao adicionar montagem:", error);
    throw new Error("Erro ao adicionar montagem ao Icecast");
  }
};

// Rota para criar a estação e adicionar ao Icecast
app.post("/add-mount", async (req, res) => {
  try {
    const {mountName, username, password, streamKey} = req.body;

    if (!mountName || !username || !password || !streamKey) {
      return res.status(400).json({error: "Campos são obrigatórios."});
    }

    // Aqui você pode chamar a função para adicionar a montagem no Icecast
    const mountResponse = await addMountToIcecast(mountName, streamKey);

    // Sucesso
    res.status(200).json({message: "Montagem criada!", mountResponse});
  } catch (error) {
    res.status(500).json({error: "Erro ao criar montagem no Icecast"});
  }
});

// Exporta a função para o Firebase Functions
exports.api = functions.https.onRequest(app);
