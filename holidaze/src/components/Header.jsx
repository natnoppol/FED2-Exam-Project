import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUser, clearAuth } from "../utils/auth";
import { fallbackImage } from "../api";
import { toast } from "react-toastify";

const ResponsiveNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = getUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const navMenuItems = user?.venueManager
    ? [
        { label: "Profile", url: "/profile" },
        { label: "Manage Venues", url: "/admin/manage-venues" },
        { label: "Admin Bookings", url: "/admin/bookings" },
      ]
    : user
    ? [{ label: "Profile", url: "/profile" }]
    : [];

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold">
            Holidaze
          </Link>

          {!user && (
            <div className="md:hidden">
              <Link
                to="/login"
                className="text-sm bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
              >
                Login
              </Link>
            </div>
          )}

          {user && (
            <div className="flex md:hidden items-center space-x-3">
              <div className="text-sm text-right">
                <p>{user.name}</p>
                <p className="text-gray-400">{user.venueManager ? "Admin" : "Customer"}</p>
              </div>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="focus:outline-none"
                aria-label="Toggle mobile menu"
              >
                <img
                  src={user.avatar?.url || fallbackImage}
                  alt={user.avatar?.alt || user.name}
                  className="w-10 h-10 rounded-full"
                />
              </button>
            </div>
          )}

          <ul className="hidden md:flex space-x-6 items-center">
            {navMenuItems.map((item) => (
              <li key={item.url}>
                <Link
                  to={item.url}
                  className="text-gray-300 hover:text-white hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {user ? (
              <li>
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-white hover:underline"
                >
                  Logout
                </button>
              </li>
            ) : (
              <li>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white hover:underline"
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>

      {isOpen && user && (
        <div className="md:hidden">
          <ul className="space-y-2 px-4 py-3 bg-gray-700">
            {navMenuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.url}
                  className="block text-gray-300 hover:text-white hover:underline"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
            
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="w-full text-left text-gray-300 hover:text-white hover:underline"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default ResponsiveNav;
