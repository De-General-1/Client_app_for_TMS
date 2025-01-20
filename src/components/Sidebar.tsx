import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import task_logo from "../assets/images/task_logo.png";
import { useAuth } from "react-oidc-context";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const auth = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (
      auth.isAuthenticated &&
      Array.isArray(auth.user?.profile["cognito:groups"])
    ) {
      const groups = auth.user?.profile["cognito:groups"] as string[];

      if (groups.includes("Admin")) {
        setRole("Admin");
      } else if (groups.includes("Team_members")) {
        setRole("Team_member");
      }
    }
  }, [auth]);

  // Hide the sidebar on the `/` route (or any other route you specify)
  if (location.pathname === "/") {
    return null;
  }

  return (
    <aside
      className={`fixed z-10 inset-y-0 left-0 bg-white shadow-md transition-all duration-300 ${
        collapsed ? "w-20" : "w-60"
      } max-h-screen`}
    >
      <div className="flex flex-col justify-between h-full">
        <div className="flex-grow">
          <div className="px-4 py-6 text-center border-b">
            <h1
              className={`text-xl font-bold leading-none transition-all duration-300`}
            >
              <img src={task_logo} className="text-yellow-700 w-10 h-10" />
            </h1>
          </div>
          <div className="p-4">
            <ul className="space-y-1">
              <li>
                <Link
                  to={`${
                    role === "Admin" ? "/admin-dashboard" : "member-dashboard"
                  }`}
                  className="flex items-center bg-white hover:bg-yellow-50 rounded-xl font-bold text-sm text-gray-900 py-3 px-4"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="text-lg" // Added class for styling instead of inline style
                  >
                    <path d="M12.74 2.32a1 1 0 0 0-1.48 0l-9 10A1 1 0 0 0 3 14h2v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7h2a1 1 0 0 0 1-1 1 1 0 0 0-.26-.68z"></path>
                  </svg>
                  <span className={`${collapsed ? "hidden" : "flex ml-4"}`}>
                    Dashboard
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to={`${
                    role === "Admin" ? "/admin-dashboard" : "member-dashboard"
                  }`}
                  className="flex bg-white hover:bg-yellow-50 rounded-xl font-bold text-sm text-gray-900 py-3 px-4"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    className="text-lg"
                    viewBox="0 0 16 16"
                  >
                    <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM5 4h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1zm-.5 2.5A.5.5 0 0 1 5 6h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zM5 8h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1zm0 2h3a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1z" />
                  </svg>
                  <span className={`${collapsed ? "hidden" : "flex ml-4"}`}>
                    Task List
                  </span>
                </Link>
              </li>
              <li className={`${role === "Admin" ? "block" : "hidden"}`}>
                <Link
                  to={`${role === "Admin" ? "/create-task" : ""}`}
                  className="flex items-center bg-white hover:bg-yellow-50 rounded-xl font-bold text-sm text-gray-900 py-3 px-4"
                >
                  <i className="bx bxs-edit text-2xl"></i>
                  <span className={`${collapsed ? "hidden" : "flex ml-3"}`}>
                    Create Task
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Collapse button */}
        <div className="p-4">
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="inline-flex items-center justify-center h-9 px-4 rounded-xl bg-gray-900 text-gray-300 hover:text-white text-sm font-semibold transition"
          >
            {collapsed ? "Expand" : "Collapse"}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
