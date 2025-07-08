// src/components/TaskList.tsx
import { useEffect, useState } from "react";

type Task = {
  id: string;
  title: string;
  description: string;
};

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/tasks")
      .then((res) => res.json())
      .then(setTasks);
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setTasks((prev) => prev.filter((task) => task.id !== id));
      } else {
        alert("Erro ao excluir tarefa");
      }
    } catch (err) {
      console.error(err);
      alert("Erro de rede");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-white">Suas Tarefas</h2>
      <div className="grid grid-cols-1 gap-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white border-l-4 border-green-600 shadow-lg rounded-lg p-5 flex justify-between items-start hover:shadow-xl transition-all duration-300"
          >
            <div className="pr-4">
              <h3 className="text-xl font-bold text-gray-800">{task.title}</h3>
              <p className="text-gray-600 text-sm mt-1">{task.description}</p>
            </div>
            <button
              onClick={() => handleDelete(task.id)}
              className="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600 transition"
            >
              Excluir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
