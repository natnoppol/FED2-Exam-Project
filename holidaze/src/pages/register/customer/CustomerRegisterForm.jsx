import { registerUser } from "../../../../src/api/auth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ErrorMessage from "../../../components/ErrorMessage";
import { AiOutlineUser, AiOutlineMail, AiOutlineLock } from "react-icons/ai"; // Import icons from React Icons

const schema = Yup.object({
  name: Yup.string()
    .matches(/^[A-Za-z0-9_]+$/, "Only letters, numbers, and underscores allowed")
    .required(),
  email: Yup.string()
    .email()
    .matches(/^[a-zA-Z0-9._%+-]+@stud\.noroff\.no$/, "Must be a @stud.noroff.no email")
    .required(),
  password: Yup.string().min(8, "Password must be at least 8 characters").required(),
});

function CustomerRegisterForm() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const handleError = (err) => {
    if (err.response && err.response.status === 409) {
      setError("Email is already registered.");
    } else if (err.message === "Network Error") {
      setError("There was an issue connecting to the server. Please try again later.");
    } else {
      setError("An unexpected error occurred. Please try again.");
    }
    console.error("Registration error:", err);
  };

  const onSubmit = async (data) => {
    setError(""); // Reset error state on each submission
    try {
      await registerUser({ ...data, venueManager: false });
      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-4 space-y-4 bg-white shadow rounded mt-8">
      <h2 className="text-xl font-semibold text-center">Register as Customer</h2>

      <ErrorMessage message={error} />
      {success && <div className="text-green-600 text-center">{success}</div>}

      <div className="flex items-center border rounded p-2">
        <AiOutlineUser className="text-gray-500 mr-2" />
        <input {...register("name")} className="w-full p-2 border-none" placeholder="Name" />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      <div className="flex items-center border rounded p-2">
        <AiOutlineMail className="text-gray-500 mr-2" />
        <input {...register("email")} className="w-full p-2 border-none" placeholder="Email" />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div className="flex items-center border rounded p-2">
        <AiOutlineLock className="text-gray-500 mr-2" />
        <input type="password" {...register("password")} className="w-full p-2 border-none" placeholder="Password" />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>

      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 cursor-pointer">
        Register
      </button>
      <button
        type="button"
        onClick={() => navigate("/register")}
        className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 cursor-pointer"
      >
        Cancel
      </button>
    </form>
  );
}

export default CustomerRegisterForm;
