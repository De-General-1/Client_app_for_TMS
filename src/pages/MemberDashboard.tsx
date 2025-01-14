import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import LoadingSpinner from "../components/LoadingSpinner"; // loading spinner component

const MemberDashboard: React.FC = () => {
  const auth = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchTasks = async (userId: string) => {
    try {
      const response = await fetch(
        "https://ry4hi4iasd.execute-api.eu-west-1.amazonaws.com/getAllTasks"
      );
      const data = await response.json();

      if (response.ok) {
        if (data && Array.isArray(data)) {
          const userTasks = data.filter((task: any) =>
            task.assigned_to.includes(userId)
          );
          setTasks(userTasks);
        } else {
          setError("No tasks found.");
        }
      } else {
        setError(data.message || "Failed to fetch tasks.");
      }
    } catch (err) {
      setError("There was an error fetching your tasks.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const response = await fetch(
        "https://ry4hi4iasd.execute-api.eu-west-1.amazonaws.com/update_status",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: taskId,
            status: newStatus,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId ? { ...task, status: newStatus } : task
          )
        );
        alert("Task status updated successfully");
        if (newStatus === "Completed") {
          alert("Task marked as completed. The admin has been notified.");
        }
      } else {
        setError(data.body || "Failed to update status.");
      }
    } catch (err) {
      setError("There was an error updating the task status.");
      console.error(err);
    }
  };

  useEffect(() => {
    if (auth.isAuthenticated && auth.user?.profile.sub) {
      const userId = auth.user.profile.sub;
      fetchTasks(userId);
    }
  }, [auth]);

  return (
    <div className="flex bg-yellow-50 min-h-screen">
      {/* Main content */}
      <main className="w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Member Dashboard</h1>
        </div>

        {/* Loading or Error State */}
        {loading && <LoadingSpinner />}
        {error && <p className="text-red-500">{error}</p>}

        {/* Display tasks */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Your Tasks
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-6 bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-200 ease-in-out"
                >
                  <h3 className="text-xl font-semibold text-gray-800">
                    <button
                      onClick={() => navigate(`/task-details/${task.id}`)}
                      className="hover:underline"
                    >
                      {task.title}
                    </button>
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">
                    {task.description}
                  </p>
                  <div className="flex justify-between mt-4">
                    <span className="text-sm text-gray-600">
                      Status: {task.status}
                    </span>
                    <span className="text-sm text-gray-400">
                      {task.due_date}
                    </span>
                  </div>

                  {/* Task status update */}
                  <div className="mt-4">
                    <select
                      value={task.status}
                      onChange={(e) =>
                        updateTaskStatus(task.id, e.target.value)
                      }
                      className="w-full border p-2 rounded-md bg-gray-50"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">
                No tasks assigned to you at the moment.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MemberDashboard;
