import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { db, Task } from "./db";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Servidor da Jetsales API está no ar 🚀");
});

app.post("/tasks", (req, res) => {
  const { title, description, executeAt } = req.body;

  if (!title || !description || !executeAt) {
    return res
      .status(400)
      .json({ error: "Título, descrição e horário são obrigatórios" });
  }

  const executeAtDate = new Date(executeAt);
  if (isNaN(executeAtDate.getTime()) || executeAtDate <= new Date()) {
    return res.status(400).json({ error: "Horário inválido ou no passado" });
  }

  const newTask: Task = {
    id: uuidv4(),
    title,
    description,
    executeAt: executeAtDate.toISOString(),
  };

  db.read();
  db.data!.tasks.push(newTask);
  db.write();

  return res.status(201).json(newTask);
}); // <- aqui fecha a rota corretamente

const start = () => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  });
};

start();
