import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

interface Task {
  id: string;
  title: string;
  description: string;
  assigned_to: string;
  status: string;
  due_date: string;
  start_date: string;
}

const Tasks: React.FC = () => {
  const { user, getUserRole } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      const response = await fetch(
        "https://ry4hi4iasd.execute-api.eu-west-1.amazonaws.com/getAllTasks"
      );
      const data = await response.json();
      if (response.ok) {
        setTasks(data);
      } else {
        throw new Error("Failed to fetch tasks");
      }
    } catch (error: any) {
      setError(error.message || "An error occurred while fetching tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      const fetchRole = async () => {
        const userRole = await getUserRole(user.profile.sub);
        setRole(userRole);
      };
      fetchRole();
    }
    fetchTasks();
  }, [user, getUserRole]);

  // Check if tasks and role are available before attempting to filter tasks
  const filteredTasks =
    role && tasks
      ? role === "Admin"
        ? tasks
        : tasks.filter((task) => task.assigned_to === user?.profile.username)
      : [];

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Tasks</h1>
      <ul className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <li key={task.id} className="border p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">{task.title}</h2>
              <p className="text-sm text-gray-600">{task.description}</p>
              <p className="text-sm font-semibold">Status: {task.status}</p>
              <p className="text-sm font-semibold">
                Start Date: {task.start_date}
              </p>
              <p className="text-sm text-gray-500">Due: {task.due_date}</p>
              <Link
                to={`/tasks/${task.id}`}
                className="mt-2 inline-block text-blue-500 hover:text-blue-700"
              >
                View Task Details
              </Link>
            </li>
          ))
        ) : (
          <p>No tasks assigned.</p>
        )}
      </ul>
    </div>
  );
};

export default Tasks;
