import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { loginUser } from "../api";
import { FiLogIn, FiMail, FiLock } from "react-icons/fi";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

   const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userData = await loginUser({ email, password });

  
      // Check if the user is a venue manager and redirect accordingly
      if (userData.venueManager) {
        navigate("/profile");  // Redirect to venue manager dashboard
      } else {
        navigate(from, { replace: true });  // Redirect to the original page or home if customer
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <FiLogIn className="text-blue-500" />
        Login
      </h2>
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="text-red-500 bg-red-100 p-2 rounded mb-4">
            {error}
          </div>
        )}
        <div className="mb-4 relative">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <FiMail className="absolute left-3 top-9 text-gray-500" />
          <input
            type="email"
            id="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full border p-2 pl-10 rounded"
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-4 relative">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <FiLock className="absolute left-3 top-9 text-gray-500" />
          <input
            type="password"
            id="password"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border p-2 pl-10 rounded"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          <FiLogIn />
          Log In
        </button>
      </form>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-500 hover:underline font-medium"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
