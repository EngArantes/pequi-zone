const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "https://pequi-zone.web.app" })); // Permite CORS apenas para o seu site

app.post("/add-mount", async (req, res) => {
    try {
        const { mountName, username, password } = req.body;

        if (!mountName || !username || !password) {
            return res.status(400).json({ error: "Dados inválidos" });
        }

        // Aqui você pode chamar o Icecast ou salvar no Firestore

        res.status(200).json({ message: "Montagem adicionada com sucesso!" });
    } catch (error) {
        res.status(500).json({ error: "Erro no servidor" });
    }
});

exports.api = functions.https.onRequest(app);
