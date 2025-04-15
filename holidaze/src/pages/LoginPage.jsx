import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../api";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
   // If redirected from a protected route, the location.state.from holds the path
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await loginUser({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };
 

  return (
    <div>
    <h2>Login</h2>
    <form onSubmit={handleSubmit}>
      {/* Input fields for email and password */}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <p className="text-red-600">{error}</p>}
      <button type="submit">Log In</button>
    </form>
  </div>
);
};

export default LoginPage;