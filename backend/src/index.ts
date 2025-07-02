import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDB } from "./db"; // importa função de inicialização do banco

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Servidor da Jetsales API está no ar 🚀");
});

// Função assíncrona para iniciar o banco e o servidor
const start = async () => {
  await initDB(); // inicializa o banco de dados (lowdb)
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  });
};

start();
