import { useState } from "react";
import { toast } from "react-toastify";
import { updateProfile } from "../api";

export const useUpdateProfile = () => {
  const [updating, setUpdating] = useState(false);

  const updateUserProfile = async (username, formData, onSuccess) => {
    setUpdating(true);
    try {
      const updated = await updateProfile(username, formData);
      localStorage.setItem("user", JSON.stringify(updated)); // persist change
      toast.success("Profile updated!");
      onSuccess(updated);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    } finally {
      setUpdating(false);
    }
  };

  return { updating, updateUserProfile };
};