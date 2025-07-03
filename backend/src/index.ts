import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { db, initDB } from "./database";
import { generateToken, authMiddleware } from "./auth"; // ← import do auth

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rota de login (geração de JWT)
app.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body;
  // Usuário fixo apenas como exemplo
  if (username === "admin" && password === "password") {
    const token = generateToken({ username });
    return res.json({ token });
  }
  return res.status(401).json({ error: "Credenciais inválidas" });
});

// Rota para listar tarefas (pública)
app.get("/tasks", async (req: Request, res: Response) => {
  await db.read();
  res.json(db.data?.tasks || []);
});

// Rota para criar nova tarefa (protegida)
app.post("/tasks", authMiddleware, async (req: Request, res: Response) => {
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

// Rota para editar uma tarefa existente (protegida)
app.put("/tasks/:id", authMiddleware, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description } = req.body;

  await db.read();
  const task = db.data?.tasks.find((task) => task.id === id);

  if (!task) {
    return res.status(404).json({ message: "Tarefa não encontrada" });
  }

  if (title) task.title = title;
  if (description) task.description = description;

  await db.write();
  res.json(task);
});

// Rota para excluir uma tarefa pelo ID (protegida)
app.delete(
  "/tasks/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    await db.read();
    const before = db.data?.tasks.length || 0;
    db.data!.tasks = db.data!.tasks.filter((task) => task.id !== id);

    if (db.data!.tasks.length === before) {
      return res.status(404).json({ error: "Tarefa não encontrada." });
    }

    await db.write();
    res.status(200).json({ message: "Tarefa excluída com sucesso." });
  }
);

// Inicializa o banco e servidor
const start = async () => {
  await initDB();
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
};

start();
