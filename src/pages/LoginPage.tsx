import React from "react";
import { useAuth } from "react-oidc-context";

const LoginPage: React.FC = () => {
  const { signinRedirect } = useAuth();

  const handleLogin = async () => {
    await signinRedirect(); // Start the sign-in process
  };

  return (
    <div>
      <button onClick={handleLogin}>Sign in with Cognito</button>
    </div>
  );
};

export default LoginPage;
