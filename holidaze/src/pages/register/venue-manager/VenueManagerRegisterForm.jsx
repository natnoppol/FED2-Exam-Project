import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { registerUser } from "../../../../src/api/auth";
import { useNavigate } from "react-router-dom";

const schema = Yup.object().shape({
    name: Yup.string()
      .matches(/^[A-Za-z0-9_]+$/, "Only letters, numbers, and underscores allowed")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email")
      .matches(/^[a-zA-Z0-9._%+-]+@stud\.noroff\.no$/, "Must be a @stud.noroff.no email")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    bio: Yup.string().max(160, "Bio must be less than 160 characters"),
    avatarUrl: Yup.string().url("Invalid URL"),
    avatarAlt: Yup.string().max(120, "Alt must be less than 120 characters"),
    bannerUrl: Yup.string().url("Invalid URL"),
    bannerAlt: Yup.string().max(120, "Alt must be less than 120 characters"),
  });
  
function VenueManagerRegisterForm() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm({ resolver: yupResolver(schema) });
  
    const onSubmit = async (formData) => {
      setError("");
      try {
        const payload = {
          ...formData,
          venueManager: true,
          avatar: formData.avatarUrl
            ? { url: formData.avatarUrl, alt: formData.avatarAlt || "" }
            : undefined,
          banner: formData.bannerUrl
            ? { url: formData.bannerUrl, alt: formData.bannerAlt || "" }
            : undefined,
        };
  
        await registerUser(payload);
        setSuccess("Account created successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } catch (err) {
        if (err.response && err.response.status === 409) {
            setError("Email is already registered.");
          } else if (err.message === "Network Error") {
            setError("There was an issue connecting to the server. Please try again later.");
          } else {
            setError("An unexpected error occurred. Please try again.");
          }
      }
    };
  
    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl mx-auto p-6 mt-8 space-y-4 bg-white shadow rounded"
      >
        <h2 className="text-2xl font-semibold text-center">Register as Venue Manager</h2>
  
        {error && <p className="text-red-600 text-center">{error}</p>}
        {success && <p className="text-green-600 text-center">{success}</p>}
  
        <div>
          <label className="block font-medium">Name</label>
          <input {...register("name")} className="w-full p-2 border rounded" />
          {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
        </div>
  
        <div>
          <label className="block font-medium">Email</label>
          <input {...register("email")} className="w-full p-2 border rounded" />
          {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
        </div>
  
        <div>
          <label className="block font-medium">Password</label>
          <input type="password" {...register("password")} className="w-full p-2 border rounded" />
          {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
        </div>
  
        <div>
          <label className="block font-medium">Bio (optional)</label>
          <textarea {...register("bio")} className="w-full p-2 border rounded" />
          {errors.bio && <p className="text-red-600 text-sm">{errors.bio.message}</p>}
        </div>
  
        <div>
          <label className="block font-medium">Avatar URL (optional)</label>
          <input {...register("avatarUrl")} className="w-full p-2 border rounded" />
          {errors.avatarUrl && <p className="text-red-600 text-sm">{errors.avatarUrl.message}</p>}
        </div>
  
        <div>
          <label className="block font-medium">Avatar Alt (optional)</label>
          <input {...register("avatarAlt")} className="w-full p-2 border rounded" />
          {errors.avatarAlt && <p className="text-red-600 text-sm">{errors.avatarAlt.message}</p>}
        </div>
  
        <div>
          <label className="block font-medium">Banner URL (optional)</label>
          <input {...register("bannerUrl")} className="w-full p-2 border rounded" />
          {errors.bannerUrl && <p className="text-red-600 text-sm">{errors.bannerUrl.message}</p>}
        </div>
  
        <div>
          <label className="block font-medium">Banner Alt (optional)</label>
          <input {...register("bannerAlt")} className="w-full p-2 border rounded" />
          {errors.bannerAlt && <p className="text-red-600 text-sm">{errors.bannerAlt.message}</p>}
        </div>
  
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Register
        </button>
        <button
          type="cancel"
            onClick={() => navigate("/register")}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Cancel
        </button>
      </form>
    );
  }

  export default VenueManagerRegisterForm