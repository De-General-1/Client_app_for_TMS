import React, { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import AdminDashboard from "./pages/AdminDashboard";
import MemberDashboard from "./pages/MemberDashboard";
import CreateTask from "./pages/CreateTask";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import TaskDetails from "./pages/TaskDetail";

const App: React.FC = () => {
  const auth = useAuth();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (
      auth.isAuthenticated &&
      Array.isArray(auth.user?.profile["cognito:groups"])
    ) {
      // Safely cast to array and check for the group
      const groups = auth.user?.profile["cognito:groups"] as string[];

      if (groups.includes("Admin")) {
        setRole("Admin");
      } else if (groups.includes("Team_members")) {
        setRole("Team_member");
      }
    }
  }, [auth]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout role={role} />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/admin-dashboard",
          element:
            role === "Admin" ? (
              <AdminDashboard role={role} />
            ) : (
              <div>Access Denied</div>
            ),
        },
        {
          path: "/member-dashboard",
          element:
            role === "Team_member" ? (
              <MemberDashboard />
            ) : (
              <div>Access Denied</div>
            ),
        },
        {
          path: "/create-task",
          element: role === "Admin" ? <CreateTask /> : <div>Access Denied</div>,
        },
        {
          path: "/task-details/:taskId",
          element: <TaskDetails role={role} />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
