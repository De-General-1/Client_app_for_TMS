import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "react-oidc-context";

interface HeaderProps {
  collapsed: boolean;
}

const Header: React.FC<HeaderProps> = ({}) => {
  const auth = useAuth();
  const [role, setRole] = useState<string | null>(null);

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

  const signOutRedirect = () => {
    const clientId = "1tsvk54e4kl3ffh9lmr54mlhqk";
    const logoutUri = "http://localhost:5173/";
    const cognitoDomain =
      "https://eu-west-1ezjfeawim.auth.eu-west-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      logoutUri
    )}`;
    auth.removeUser();
  };

  return (
    <header
      className={`bg-gray-800 text-white p-4 shadow-md transition-all duration-300`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Task Management System</h1>
        <nav className="space-x-4 flex items-center">
          {auth.isAuthenticated ? (
            <>
              <Link to="/" className="hover:text-blue-400">
                Home
              </Link>
              {role === "Admin" ? (
                <>
                  <Link to="/admin-dashboard" className="hover:text-blue-400">
                    Admin Dashboard
                  </Link>
                  <Link to="/create-task" className="hover:text-blue-400">
                    Create Task
                  </Link>
                </>
              ) : (
                <Link to="/member-dashboard" className="hover:text-blue-400">
                  Member Dashboard
                </Link>
              )}
              {/* Sign Out button triggers the redirect to Cognito logout */}
              <button
                onClick={signOutRedirect}
                className="bg-red-600 px-8 py-2 rounded-full hover:bg-red-700"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={() => auth.signinRedirect()}
              className="bg-blue-600 px-8 py-2 rounded-full hover:bg-blue-700"
            >
              Sign In
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
