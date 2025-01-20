import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get("token");

    if (token) {
      // Redirect to EventsPage if the token exists
      navigate("/events");
    }
  }, [navigate]);

  const handleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google"; // Initiates Google OAuth
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <button
        className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600"
        onClick={handleLogin}
      >
        Login with Google
      </button>
    </div>
  );
};

export default LoginPage;
