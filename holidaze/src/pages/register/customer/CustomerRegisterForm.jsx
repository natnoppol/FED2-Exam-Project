import { registerUser } from "../../../../src/api/auth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const schema = Yup.object({
  name: Yup.string()
    .matches(/^[A-Za-z0-9_]+$/, "Only letters, numbers, and underscores allowed")
    .required(),
  email: Yup.string()
    .email()
    .matches(/^[a-zA-Z0-9._%+-]+@stud\.noroff\.no$/, "Must be a @stud.noroff.no email")
    .required(),
  password: Yup.string().min(8).required(),
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

  const onSubmit = async (data) => {
    setError("");
    try {
      await registerUser({ ...data, venueManager: false });
      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-4 space-y-4 bg-white shadow rounded mt-8">
      <h2 className="text-xl font-semibold text-center">Register as Customer</h2>

      {error && <div className="text-red-500 text-center">{error}</div>}
      {success && <div className="text-green-600 text-center">{success}</div>}

      <div>
        <label className="block font-medium">Name</label>
        <input {...register("name")} className="w-full p-2 border rounded" />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block font-medium">Email</label>
        <input {...register("email")} className="w-full p-2 border rounded" />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block font-medium">Password</label>
        <input type="password" {...register("password")} className="w-full p-2 border rounded" />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>

      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
        Register
      </button>
      <button
           type="button"
            onClick={() => navigate("/register")}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Cancel
        </button>
    </form>
  );
}

export default CustomerRegisterForm