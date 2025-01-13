import React from "react";

const ErrorPage: React.FC = () => {
  return (
    <div className="text-center py-10">
      <h1 className="text-4xl font-bold mb-4">Error</h1>
      <p className="text-lg mb-6">
        We couldn't find a valid role for you. Please contact support.
      </p>
    </div>
  );
};

export default ErrorPage;
