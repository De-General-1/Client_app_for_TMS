import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

const getUserDetails = async (userId: string) => {
  try {
    const response = await fetch(
      `https://ry4hi4iasd.execute-api.eu-west-1.amazonaws.com/getUserById?userId=${userId}`,
      { method: "GET" }
    );
    const user = await response.json();
    return user;
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
};

interface TaskDetailsProps {
  role: string | null;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ role }) => {
  const { taskId } = useParams();
  const [task, setTask] = useState<any>(null);
  const [assignedUsers, setAssignedUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [statusLoading, setStatusLoading] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!taskId) return;

    const fetchTaskDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://ry4hi4iasd.execute-api.eu-west-1.amazonaws.com/getTaskById?id=${taskId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch task details");
        }
        const data = await response.json();
        setTask(data);

        // Fetch user details for each assigned user (by userId)
        const users = await Promise.all(
          data.assigned_to.map(async (userId: string) => {
            const user = await getUserDetails(userId);
            return user;
          })
        );
        setAssignedUsers(users);
      } catch (error) {
        setError("An error occurred while fetching task details.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [taskId]);

  const saveTaskChanges = async () => {
    if (!taskId) return;

    try {
      const response = await fetch(
        "https://ry4hi4iasd.execute-api.eu-west-1.amazonaws.com/update_task",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(task),
        }
      );

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        console.log(data);
        setTask(data); // Update task state with the new data
        setIsEditing(false); // Exit edit mode
        setShowSuccessModal(true); // Show success message
      } else {
        setError(data.body || "Failed to update task.");
      }
    } catch (error) {
      setError("An error occurred while saving task changes.");
      console.error(error);
    }
  };

  // Delete task function
  const deleteTask = async () => {
    if (!taskId) return;

    try {
      const response = await fetch(
        `https://ry4hi4iasd.execute-api.eu-west-1.amazonaws.com/deleteById?id=${taskId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        navigate("/admin-dashboard");
      } else {
        setError("Failed to delete task");
      }
    } catch (error) {
      setError("An error occurred while deleting the task.");
      console.error(error);
    }
  };

  // Update task status function
  const updateTaskStatus = async (newStatus: string) => {
    if (!taskId) return;

    setStatusLoading(true);

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
        setTask((prevTask: any) => ({ ...prevTask, status: newStatus }));
        setShowSuccessModal(true);
      } else {
        setError(data.body || "Failed to update status.");
      }
    } catch (err) {
      setError("An error occurred while updating the task status.");
      console.error(err);
    } finally {
      setStatusLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  if (!task) {
    return <p className="text-gray-500">Task not found.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center py-12 px-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl p-10 space-y-8">
        {/* Title & Back Button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-semibold text-gray-800">Task Details</h1>
        </div>

        {/* Task Details */}
        <div className="space-y-6 mb-8">
          <div>
            <label className="text-lg font-medium text-gray-600">Title:</label>
            <input
              type="text"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              readOnly={!isEditing}
              className="mt-2 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="text-lg font-medium text-gray-600">
              Description:
            </label>
            <textarea
              value={task.description}
              onChange={(e) =>
                setTask({ ...task, description: e.target.value })
              }
              readOnly={!isEditing}
              className="mt-2 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="text-lg font-medium text-gray-600">Status:</label>
            <div
              className={`mt-2 mx-4 inline-flex items-center px-4 py-2 text-xs font-semibold rounded-full
            ${
              task.status === "Completed"
                ? "bg-green-200 text-green-800"
                : task.status === "In Progress"
                ? "bg-yellow-200 text-yellow-800"
                : "bg-red-200 text-red-800"
            }`}
            >
              {task.status}
            </div>
          </div>

          <div>
            <label className="text-lg font-medium text-gray-600">
              Start Date:
            </label>
            <input
              type="date"
              value={task.start_date}
              onChange={(e) => setTask({ ...task, start_date: e.target.value })}
              readOnly={!isEditing}
              className="mt-2 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="text-lg font-medium text-gray-600">
              Due Date:
            </label>
            <input
              type="date"
              value={task.due_date}
              onChange={(e) => setTask({ ...task, due_date: e.target.value })}
              readOnly={!isEditing}
              className="mt-2 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="text-lg font-medium text-gray-600">
              Assigned To:
            </label>
            <div className="flex flex-wrap items-start mt-2">
              {assignedUsers && assignedUsers.length > 0 ? (
                assignedUsers.map((user, index) => (
                  <div key={index} className="mx-3">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                      {user
                        ? user.username?.substring(0, 2).toUpperCase()
                        : "UO"}
                    </div>
                    <span className="text-lg text-center text-gray-600 mt-1">
                      {user ? user.username : ""}
                    </span>
                  </div>
                ))
              ) : (
                <span className="text-sm text-gray-600">Not Assigned</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {role === "Admin" && (
          <div className="flex justify-between space-x-6 mt-6">
            {isEditing ? (
              <button
                className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
                onClick={saveTaskChanges}
              >
                Save Changes
              </button>
            ) : (
              <button
                className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
                onClick={() => setIsEditing(true)}
              >
                Edit Task
              </button>
            )}
            <button
              className="px-6 py-3 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 focus:outline-none transition-colors duration-300"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete Task
            </button>
          </div>
        )}

        {role === "Team_member" && (
          <div className="flex justify-between space-x-6 mt-6">
            <button
              className="px-6 py-3 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-700 focus:outline-none transition-colors duration-300"
              onClick={() => updateTaskStatus("Completed")}
            >
              Mark as completed
            </button>
          </div>
        )}
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

      {/* Success modal for status update */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800">
              Task Updated Successfully!
            </h3>
            <p className="mt-4 text-lg text-gray-600">
              The task has been marked as completed, and the admin has been
              notified.
            </p>
            <div className="mt-4">
              <button
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                onClick={() => setShowSuccessModal(false)}
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

export default TaskDetails;
