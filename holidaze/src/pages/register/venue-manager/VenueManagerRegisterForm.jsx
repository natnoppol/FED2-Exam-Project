import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../../../src/api/auth";
import TextInput from "../../../components/register/TextInput";
import TextAreaInput from "../../../components/register/TextAreaInput";
import ImageInputPreview from "../../../components/register/ImageInputPreview";
import FormError from "../../../components/register/FormError";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

const schema = Yup.object().shape({
  name: Yup.string()
    .matches(/^[A-Za-z0-9_]+$/, "Only letters, numbers, and underscores allowed")
    .required("Name is required"),
  email: Yup.string()
    .email("Invalid email")
    .matches(/^[a-zA-Z0-9._%+-]+@stud\.noroff\.no$/, "Must be a @stud.noroff.no email")
    .required("Email is required"),
  password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
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
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const avatarUrl = watch("avatarUrl");
  const bannerUrl = watch("bannerUrl");

  const onSubmit = async (formData) => {
    setError("");
    try {
      const payload = {
        ...formData,
        venueManager: true,
        avatar: formData.avatarUrl ? { url: formData.avatarUrl, alt: formData.avatarAlt || "" } : undefined,
        banner: formData.bannerUrl ? { url: formData.bannerUrl, alt: formData.bannerAlt || "" } : undefined,
      };
      await registerUser(payload);
      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      if (err.response?.status === 409) {
        setError("Email is already registered.");
      } else if (err.message === "Network Error") {
        setError("Connection issue. Try again later.");
      } else {
        setError("Unexpected error. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl mx-auto p-6 mt-8 space-y-4 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold text-center">Register as Venue Manager</h2>

      <FormError error={error} />
      {success && <p className="text-green-600 text-center">{success}</p>}

      <TextInput label="Name" icon={FaUser} {...register("name")} error={errors.name?.message} />
      <TextInput label="Email" icon={FaEnvelope} {...register("email")} error={errors.email?.message} />
      <TextInput label="Password" icon={FaLock} type="password" {...register("password")} error={errors.password?.message} />
      <TextAreaInput label="Bio (optional)" {...register("bio")} error={errors.bio?.message} />

      <ImageInputPreview
        label="Avatar URL (optional)"
        register={register("avatarUrl")}
        watchValue={avatarUrl}
        altLabel="Avatar Alt (optional)"
        altRegister={register("avatarAlt")}
        errorUrl={errors.avatarUrl?.message}
        errorAlt={errors.avatarAlt?.message}
      />

      <ImageInputPreview
        label="Banner URL (optional)"
        register={register("bannerUrl")}
        watchValue={bannerUrl}
        altLabel="Banner Alt (optional)"
        altRegister={register("bannerAlt")}
        errorUrl={errors.bannerUrl?.message}
        errorAlt={errors.bannerAlt?.message}
      />

      <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 cursor-pointer">
        Register
      </button>
      <button type="button" onClick={() => navigate("/register")} className="w-full bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 cursor-pointer">
        Cancel
      </button>
    </form>
  );
}

export default VenueManagerRegisterForm;
