import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface LayoutProps {
  role: string | null;
}

const Layout: React.FC<LayoutProps> = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const showSidebar = location.pathname !== "/";

  useEffect(() => {
    if (role === "Admin") {
      navigate("/admin-dashboard");
    } else if (role === "Team_member") {
      navigate("/member-dashboard");
    }
  }, [role, navigate]);

  return (
    <div className="flex min-h-screen">
      {/* Conditionally render the Sidebar */}
      {showSidebar && (
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      )}

      <div
        className={`flex-1 transition-all duration-300 ${
          showSidebar ? (collapsed ? "ml-16" : "ml-60") : ""
        }`}
      >
        <Header collapsed={collapsed} />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
