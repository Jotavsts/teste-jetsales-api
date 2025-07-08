// src/App.tsx
import React from "react";
import { TaskList } from "./components/TaskList";

function App() {
  return (
    <main className="min-h-screen bg-[#1B4348] text-white px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Minhas Tarefas</h1>

      <section className="bg-white p-6 rounded-lg shadow-md text-gray-800">
        <h2 className="text-2xl font-semibold mb-4">Suas Tarefas</h2>
        <TaskList />
      </section>
    </main>
  );
}

export default App;
