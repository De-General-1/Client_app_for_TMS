import React from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
import task_logo from "../assets/images/task_logo.png";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const location = useLocation(); // Get the current location

  // Hide the sidebar on the `/` route (or any other route you specify)
  if (location.pathname === "/") {
    return null; // Don't render the sidebar
  }

  return (
    <aside
      className={`fixed inset-y-0 left-0 bg-white shadow-md transition-all duration-300 ${
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
              {/* Menu Item 1 */}
              <li>
                <a
                  href="#"
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
                    <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4V.5zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2zm-3.5-7h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5z" />
                  </svg>
                  <span className={`${collapsed ? "hidden" : "flex ml-4"}`}>
                    Plan
                  </span>
                </a>
              </li>
              {/* Menu Item 2 */}
              <li>
                <a
                  href="#"
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
                </a>
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
