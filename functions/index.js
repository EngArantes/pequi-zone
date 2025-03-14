const {onRequest} = require("firebase-functions/v2/https");
const {logger} = require("firebase-functions/v2");
const admin = require("firebase-admin");
const {getFirestore, collection, addDoc, query, where,
  getDocs} = require("firebase-admin/firestore");
const {v4: uuidv4} = require("uuid"); // Para gerar UUIDs
const cors = require("cors")({origin: true}); // Permitir todas as origens

admin.initializeApp();
const db = getFirestore();
const streams = new Map();

// Função para criar uma estação
exports.createStation = onRequest(cors, async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Método não permitido. Use POST.");
    return;
  }

  try {
    const {name, genre, userId} = req.body;

    if (!name || !genre || !userId) {
      res.status(400)
          .send("Faltando dados obrigatórios: 'name', 'genre', 'userId'.");
      return;
    }

    // Gerar dados dinâmicos para a estação
    const streamKey = uuidv4(); // Gerar uma chave de stream única
    const streamMount = `/stream_${userId}_${name.replace(/\s+/g, "_")}`;
    const ip = "192.168.1.1";
    const port = 8000;
    const password = uuidv4();

    // Dados da nova estação
    const newStation = {
      name,
      genre,
      userId,
      streamKey,
      streamMount,
      ip,
      port,
      password,
      createdAt: new Date(),
      isLive: false,
    };

    // Salvando no Firestore
    const docRef = await addDoc(collection(db, "radioStations"), newStation);

    // Respondendo com os dados da estação criada
    res.status(201).json({
      id: docRef.id,
      ...newStation,
    });
  } catch (error) {
    logger.error("Erro ao criar estação: ", error);
    res.status(500).json({error: "Erro ao criar a estação."});
  }
});

// Função para upload do stream (transmissão)
exports.uploadStream = onRequest({timeoutSeconds: 540,
  cors: true}, async (req, res) => {
  if (req.method !== "PUT" && req.method !== "POST") {
    res.status(405).send("Método não permitido. Use PUT ou POST.");
    return;
  }

  const streamMount = req.params.streamMount;
  const streamKey = req.headers["x-stream-key"];

  if (!streamMount || !streamKey) {
    res.status(400).send("Faltam streamMount ou streamKey.");
    return;
  }

  // Verifica as credenciais no Firestore
  const stationQuery = query(
      collection(db, "radioStations"),
      where("streamMount", "==", streamMount),
      where("streamKey", "==", streamKey),
  );
  const querySnapshot = await getDocs(stationQuery);

  if (querySnapshot.empty) {
    res.status(403).send("Credenciais inválidas.");
    return;
  }

  const stationDoc = querySnapshot.docs[0];
  logger.info(`Stream iniciado para ${streamMount}`);

  // Atualiza o status para "ao vivo"
  await stationDoc.ref.update({isLive: true});

  // Armazena o stream
  streams.set(streamMount, req);

  req.on("data", (chunk) => {
    logger.info(`Dados recebidos para ${streamMount},
      tamanho: ${chunk.length}`);
  });

  req.on("end", async () => {
    logger.info(`Stream finalizado para ${streamMount}`);
    streams.delete(streamMount);
    await stationDoc.ref.update({isLive: false});
    res.status(200).end();
  });

  req.on("error", async (err) => {
    logger.error(`Erro no stream ${streamMount}:`, err);
    streams.delete(streamMount);
    await stationDoc.ref.update({isLive: false});
    res.status(500).end();
  });
});

// Função para ouvir o stream
exports.listenStream = onRequest({timeoutSeconds: 540,
  cors: true}, async (req, res) => {
  const streamMount = req.params.streamMount;

  if (req.method !== "GET") {
    res.status(405).send("Método não permitido. Use GET.");
    return;
  }

  const stationQuery = query(
      collection(db, "radioStations"),
      where("streamMount", "==", streamMount),
  );
  const querySnapshot = await getDocs(stationQuery);

  if (querySnapshot.empty) {
    res.status(404).send("Estação não encontrada.");
    return;
  }

  if (!streams.has(streamMount)) {
    res.status(503).send("A estação não está ao vivo no momento.");
    return;
  }

  res.set("Content-Type", "audio/mpeg");
  res.set("Transfer-Encoding", "chunked");

  const streamReq = streams.get(streamMount);
  streamReq.pipe(res);

  streamReq.on("end", () => {
    res.end();
  });

  streamReq.on("error", (err) => {
    logger.error(`Erro ao transmitir ${streamMount}:`, err);
    res.status(500).end();
  });
});
