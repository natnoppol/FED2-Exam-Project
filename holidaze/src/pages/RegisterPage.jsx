import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";


const schema = Yup.object().shape({
  name: Yup.string()
    .matches(/^[A-Za-z0-9_]+$/, "Only letters, numbers, and underscores are allowed")
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
  venueManager: Yup.boolean(),
});

function VenueManagerRegisterForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log("Submitted Data:", data);
    // handle registration API call here
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl mx-auto p-4 space-y-4 bg-white shadow rounded"
    >
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
        <label className="block font-medium">Avatar URL</label>
        <input {...register("avatarUrl")} className="w-full p-2 border rounded" />
        {errors.avatarUrl && <p className="text-red-600 text-sm">{errors.avatarUrl.message}</p>}
      </div>

      <div>
        <label className="block font-medium">Avatar Alt</label>
        <input {...register("avatarAlt")} className="w-full p-2 border rounded" />
        {errors.avatarAlt && <p className="text-red-600 text-sm">{errors.avatarAlt.message}</p>}
      </div>

      <div>
        <label className="block font-medium">Banner URL</label>
        <input {...register("bannerUrl")} className="w-full p-2 border rounded" />
        {errors.bannerUrl && <p className="text-red-600 text-sm">{errors.bannerUrl.message}</p>}
      </div>

      <div>
        <label className="block font-medium">Banner Alt</label>
        <input {...register("bannerAlt")} className="w-full p-2 border rounded" />
        {errors.bannerAlt && <p className="text-red-600 text-sm">{errors.bannerAlt.message}</p>}
      </div>

      <div className="flex items-center">
        <input type="checkbox" {...register("venueManager")}
          className="mr-2" />
        <label>I want to be a venue manager</label>
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Register
      </button>
    </form>
  );
}

export default VenueManagerRegisterForm