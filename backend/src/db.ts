import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

// Tipo da estrutura que vamos guardar
export type Task = {
  id: string;
  title: string;
  description: string;
  executeAt: string; // data em ISO
};

type Data = {
  tasks: Task[];
};

// Configura o adapter do lowdb
const adapter = new JSONFile<Data>("src/db.json");
const db = new Low<Data>(adapter);

// Função para inicializar o banco
export const initDB = async () => {
  await db.read();
  db.data ||= { tasks: [] }; // se não houver dados, inicia com array vazio
  await db.write();
};

export { db };
