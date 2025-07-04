// src/worker.ts
import { Worker } from "bullmq";
import dotenv from "dotenv";

dotenv.config();

const connection = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379", 10),
};

const worker = new Worker(
  "notify-task",
  async (job) => {
    console.log(`🔔 Notificando sobre a tarefa: ${job.data.title}`);
    // Aqui você pode substituir por e-mail, push, SMS, etc.
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`✅ Notificação enviada para: ${job.data.title}`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Falha ao notificar tarefa ${job?.data.title}:`, err);
});
