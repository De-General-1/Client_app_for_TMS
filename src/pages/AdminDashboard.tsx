import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
//import Sidebar from "../components/Sidebar"; // assuming Sidebar is a reusable component
import LoadingSpinner from "../components/LoadingSpinner"; // a loading spinner component

interface AdminDashboardProps {
  role: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ role }) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch tasks only if the user is an Admin
  useEffect(() => {
    if (role === "Admin") {
      const fetchTasks = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            "https://ry4hi4iasd.execute-api.eu-west-1.amazonaws.com/getAllTasks"
          );
          if (!response.ok) {
            throw new Error("Failed to fetch tasks");
          }
          const data = await response.json();
          setTasks(data || []);
        } catch (error) {
          setError("An error occurred while fetching tasks.");
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      fetchTasks();
    }
  }, [role]);

  // Delete task function
  const deleteTask = async () => {
    if (!taskToDelete) return;
    try {
      const response = await fetch(
        `https://ry4hi4iasd.execute-api.eu-west-1.amazonaws.com/deleteById?id=${taskToDelete}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setTasks(tasks.filter((task) => task.id !== taskToDelete));
        setShowDeleteModal(false);
      } else {
        setError("Failed to delete task");
      }
    } catch (error) {
      setError("An error occurred while deleting the task.");
      console.error(error);
    }
  };

  // If the user is not an admin, show access denied
  if (role !== "Admin") {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p>You do not have the necessary permissions to view this page.</p>
      </div>
    );
  }

  return (
    <div className="flex bg-yellow-50 min-h-screen">
      <div className="w-full p-6">
        <div className=" flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Admin Dashboard
          </h1>

          <div className="mt-8">
            <button
              className="px-6 py-3 bg-gray-800 text-white text-lg rounded-lg shadow-md hover:bg-gray-700 transition-colors duration-200"
              onClick={() => navigate("/create-task")}
            >
              Create New Task
            </button>
          </div>
        </div>

        <p className="text-lg text-gray-600 mb-6">
          Manage users, tasks, and settings here.
        </p>

        {/* Display loading state */}
        {loading && <LoadingSpinner />}

        {/* Display error if fetching fails */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Display all tasks for the admin */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-700">All Tasks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 z-0 motion-preset-slide-right ">
            {tasks.length > 0 ? (
              tasks.map((task) => {
                return (
                  <div
                    key={task.id}
                    className="p-6 bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-200 ease-in-out"
                  >
                    <h3 className="text-xl font-semibold text-gray-800">
                      <Link to={`/task-details/${task.id}`}>{task.title}</Link>
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

                    {/* Action buttons */}
                    <div className="mt-4 flex justify-between items-center">
                      <button
                        onClick={() => {
                          setTaskToDelete(task.id);
                          setShowDeleteModal(true);
                        }}
                        className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 focus:outline-none"
                      >
                        Delete Task
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500">No tasks available.</p>
            )}
          </div>
        </div>

        {/* Delete confirmation modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800">
                Are you sure you want to delete this task?
              </h3>
              <div className="mt-4">
                <button
                  className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-700 mr-4"
                  onClick={deleteTask}
                >
                  Yes, Delete
                </button>
                <button
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
