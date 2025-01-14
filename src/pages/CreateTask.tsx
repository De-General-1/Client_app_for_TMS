import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";

const CreateTask: React.FC = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedUsers, setAssignedUsers] = useState<any[]>([]);
  const [status, setStatus] = useState("Pending");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loading, setLoading] = useState(false); // Track the loading state for task creation
  const [error, setError] = useState<string | null>(null);
  const [successModalVisible, setSuccessModalVisible] = useState(false); // Success modal visibility
  const [errorModalVisible, setErrorModalVisible] = useState(false); // Error modal visibility
  const navigate = useNavigate();

  // Fetch users from the "Team_members" group
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await fetch(
        "https://ry4hi4iasd.execute-api.eu-west-1.amazonaws.com/getUsersInGroup"
      );
      if (response.ok) {
        const data = await response.json();
        const formattedUsers = data.map((user: any) => {
          const userAttributes = user.reduce((acc: any, attribute: any) => {
            acc[attribute.Name] = attribute.Value;
            return acc;
          }, {});

          return userAttributes;
        });
        setUsers(formattedUsers);
      } else {
        throw new Error("Failed to fetch users");
      }
    } catch (error) {
      setError("Failed to load users");
      console.error("Error fetching users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare task request with user ids and emails
    const newTask = {
      title,
      description,
      assigned_to: assignedUsers.map((user) => user.id),
      assigned_emails: assignedUsers.map((user) => user.email),
      startDate,
      dueDate,
      status,
    };

    setLoading(true); // Start loading

    try {
      const response = await fetch(
        "https://ry4hi4iasd.execute-api.eu-west-1.amazonaws.com/createTask",
        {
          method: "POST",
          body: JSON.stringify(newTask),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        setSuccessModalVisible(true); // Show success modal
        setLoading(false);
      } else {
        throw new Error("Failed to create task");
      }
    } catch (error: any) {
      setError(error.message || "Error creating task.");
      setErrorModalVisible(true); // Show error modal
      setLoading(false);
    }
  };

  // Check if the user is an admin
  const isAdmin =
    Array.isArray(user?.profile["cognito:groups"]) &&
    user.profile["cognito:groups"]?.includes("Admin");

  return (
    <div className="flex bg-gray-50">
      {/* Main content */}
      <div className="flex-1 p-8 bg-white">
        <div className="max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-lg border border-gray-300">
          <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">
            Create New Task
          </h1>

          {error && <p className="text-red-600 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-lg font-medium text-gray-700">
                Task Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-lg font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Assigned To */}
            <div className="space-y-2">
              <label className="text-lg font-medium text-gray-700">
                Assigned To
              </label>
              {loadingUsers ? (
                <div className="text-center text-gray-600">
                  Loading users...
                </div>
              ) : (
                <div className="space-y-2">
                  {users.map((user) => (
                    <div key={user.sub} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`user-${user.sub}`}
                        value={user.sub}
                        checked={assignedUsers.some(
                          (assigned) => assigned.id === user.sub
                        )}
                        onChange={(e) => {
                          const userId = e.target.value;
                          const userEmail = user.email;
                          setAssignedUsers((prevAssigned) => {
                            if (e.target.checked) {
                              return [
                                ...prevAssigned,
                                { id: userId, email: userEmail },
                              ];
                            } else {
                              return prevAssigned.filter(
                                (assigned) => assigned.id !== userId
                              );
                            }
                          });
                        }}
                        className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`user-${user.sub}`}
                        className="text-sm font-medium text-gray-700"
                      >
                        {user.name} ({user.email})
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-lg font-medium text-gray-700">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                disabled={isAdmin}
              >
                <option value="Pending">Pending</option>
              </select>
            </div>

            {/* Dates */}
            <div className="space-y-2">
              <label className="text-lg font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-lg font-medium text-gray-700">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-center mt-6 w-full">
              <button
                type="submit"
                className="px-6 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 w-full"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex justify-center items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-t-transparent border-blue-500 animate-spin rounded-full" />
                    <span>Creating...</span>
                  </div>
                ) : (
                  "Create Task"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {successModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold text-green-600 mb-4">
              Task Created Successfully!
            </h2>
            <p className="text-gray-700 mb-6">
              The task has been successfully created. You will be redirected
              shortly.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setSuccessModalVisible(false);
                  navigate("/admin-dashboard");
                }}
                className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {errorModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold text-red-600 mb-4">
              Error Creating Task
            </h2>
            <p className="text-gray-700 mb-6">{error}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setErrorModalVisible(false)}
                className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateTask;
