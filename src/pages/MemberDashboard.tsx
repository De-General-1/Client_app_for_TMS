import React, { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
//import Sidebar from "../components/Sidebar";

const MemberDashboard: React.FC = () => {
  const auth = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async (userId: string) => {
    try {
      const response = await fetch(
        `https://ry4hi4iasd.execute-api.eu-west-1.amazonaws.com/getAllTasks`
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
    <div className="relative bg-yellow-50 overflow-hidden max-h-screen">
      {/* Main content */}
      <main className="ml-60 pt-16 max-h-screen overflow-auto">
        <div className="px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-8 mb-5">
              <h1 className="text-3xl font-bold mb-10">Today's Plan</h1>

              {/* Loading or Error State */}
              {loading ? (
                <div className="flex justify-center items-center space-x-2">
                  <div className="w-6 h-6 border-4 border-t-transparent border-blue-600 rounded-full animate-spin"></div>
                  <span>Loading...</span>
                </div>
              ) : error ? (
                <div className="text-red-500 text-center mt-4">{error}</div>
              ) : tasks.length === 0 ? (
                <div className="text-gray-600 text-center mt-6">
                  <p>No tasks assigned to you at the moment.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-4 bg-white border rounded-xl text-gray-800 space-y-2"
                    >
                      <div className="flex justify-between">
                        <div className="text-gray-400 text-xs">
                          {task.assigned_to}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {task.due_date}
                        </div>
                      </div>
                      <a
                        href="javascript:void(0)"
                        className="font-bold hover:text-yellow-800 hover:underline"
                      >
                        {task.title}
                      </a>
                      <div className="text-sm text-gray-600">
                        <select
                          value={task.status}
                          onChange={(e) =>
                            updateTaskStatus(task.id, e.target.value)
                          }
                          className="ml-2 border p-2 rounded-md bg-gray-50"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MemberDashboard;
