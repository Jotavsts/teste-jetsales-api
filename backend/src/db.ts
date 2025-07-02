import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";

export type Task = {
  id: string;
  title: string;
  description: string;
  executeAt: string;
};

type Data = {
  tasks: Task[];
};

const adapter = new FileSync<Data>("src/db.json");
const db = low<Data>(adapter);

db.defaults({ tasks: [] }).write();

export { db };
