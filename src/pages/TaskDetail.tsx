import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  status: string;
  dueDate: string;
}

const TaskDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch task details by ID from API
  const fetchTask = async (taskId: string) => {
    try {
      const response = await fetch(`YOUR_API_ENDPOINT_HERE/tasks/${taskId}`);
      const data = await response.json();
      if (response.ok) {
        setTask(data.task);
      } else {
        throw new Error("Failed to fetch task");
      }
    } catch (error: any) {
      setError(error.message || "An error occurred while fetching the task.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTask(id);
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Check if user is available and handle null safely
  if (!user) {
    return <div>You are not logged in.</div>;
  }

  // Restrict access if the task is not assigned to the current user
  if (
    user.profile.role !== "admin" &&
    task?.assignedTo !== user.profile.username
  ) {
    return <div>You do not have permission to view this task.</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{task?.title}</h1>
      <p className="mb-4">{task?.description}</p>
      <p className="text-sm font-semibold">Assigned to: {task?.assignedTo}</p>
      <p className="text-sm font-semibold">Status: {task?.status}</p>
      <p className="text-sm font-semibold">Due Date: {task?.dueDate}</p>

      {user?.profile.role === "admin" && (
        <div className="mt-4">
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700"
            onClick={() => alert("Status updated to 'Completed'")} // Add logic to update status
          >
            Mark as Completed
          </button>
        </div>
      )}

      <div className="mt-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
          onClick={() => navigate("/tasks")}
        >
          Back to Task List
        </button>
      </div>
    </div>
  );
};

export default TaskDetail;
