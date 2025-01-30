const functions = require("firebase-functions");
const cors = require("cors")({ origin: true }); // Permite todas as origens (ou especifique o domínio do frontend)

exports.addMount = functions.https.onRequest((req, res) => {
  // Habilita o CORS
  cors(req, res, async () => {
    try {
      // Verifica se o método é POST
      if (req.method !== "POST") {
        return res.status(405).send("Método não permitido");
      }

      // Extrai os dados do corpo da requisição
      const { mountName, username, password } = req.body;

      // Aqui você adiciona a lógica para criar a montagem no Icecast
      console.log("Criando montagem:", { mountName, username, password });

      // Simulação de sucesso
      res.status(200).json({ success: true, message: "Montagem criada com sucesso!" });
    } catch (error) {
      console.error("Erro ao criar montagem:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
});