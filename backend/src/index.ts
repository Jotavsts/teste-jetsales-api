import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { db, initDB } from "./database";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rota para listar tarefas
app.get("/tasks", async (req: Request, res: Response) => {
  await db.read();
  res.json(db.data?.tasks || []);
});

// Rota para criar nova tarefa
app.post("/tasks", async (req: Request, res: Response) => {
  const { title, description } = req.body;

  const newTask = {
    id: uuidv4(),
    title,
    description,
    createdAt: new Date().toISOString(),
  };

  await db.read();
  db.data?.tasks.push(newTask);
  await db.write();

  res.status(201).json(newTask);
});

// Inicializa o banco e servidor
const start = async () => {
  await initDB();
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
};

start();
