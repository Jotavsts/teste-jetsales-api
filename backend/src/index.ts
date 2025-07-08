// src/index.ts
import express from "express";
import type { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import { JobsOptions } from "bullmq";
import { db, initDB } from "./database.js";
import { generateToken, authMiddleware } from "./auth.js";
import { notifyQueue } from "./queue.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS com suporte a Authorization
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// --- Rota de login (geração de JWT) ---
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "password") {
    const token = generateToken({ username });
    return res.json({ token });
  }
  return res.status(401).json({ error: "Credenciais inválidas" });
});

// --- Rota pública: listar tarefas ---
app.get("/tasks", async (_req, res) => {
  await db.read();
  res.json(db.data?.tasks || []);
});

// --- Rota protegida: criar tarefa com agendamento ---
app.post("/tasks", authMiddleware, async (req, res) => {
  const { title, description } = req.body;

  const newTask = {
    id: uuidv4(),
    title,
    description,
    createdAt: new Date().toISOString(),
  };

  await db.read();
  db.data!.tasks.push(newTask);
  await db.write();

  const offset = parseInt(process.env.NOTIFY_OFFSET_MINUTES || "5", 10);
  const notifyTime = dayjs(newTask.createdAt).add(-offset, "minute").toDate();

  const delay = 5000;
  const opts: JobsOptions = { delay };

  await notifyQueue.add("notify-task", newTask, opts);

  res.status(201).json(newTask);
});

// --- Rota protegida: editar tarefa ---
app.put("/tasks/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  await db.read();
  const task = db.data?.tasks.find((t) => t.id === id);
  if (!task) return res.status(404).json({ error: "Tarefa não encontrada" });

  if (title) task.title = title;
  if (description) task.description = description;

  await db.write();
  res.json(task);
});

// --- Rota protegida: excluir tarefa ---
app.delete("/tasks/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  await db.read();

  const originalCount = db.data?.tasks.length || 0;
  db.data!.tasks = db.data!.tasks.filter((t) => t.id !== id);

  if (db.data!.tasks.length === originalCount) {
    return res.status(404).json({ error: "Tarefa não encontrada" });
  }

  await db.write();
  res.json({ message: "Tarefa excluída com sucesso." });
});

// --- Inicializa o banco e sobe o servidor ---
const start = async () => {
  await initDB();
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
  });
};

start();
