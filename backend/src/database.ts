import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// Corrige __dirname para ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Tipos de dados
type Task = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
};

type Data = {
  tasks: Task[];
};

// Inicializa o arquivo JSON e o banco
const file = join(__dirname, "db.json");
const adapter = new JSONFile<Data>(file);
const db = new Low<Data>(adapter);

// Cria estrutura inicial se necessário
const initDB = async () => {
  await db.read();
  db.data ||= { tasks: [] };
  await db.write();
};

export { db, initDB };
