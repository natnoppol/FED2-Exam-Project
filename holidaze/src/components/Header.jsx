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
    <nav className="bg-gradient-to-r from-indigo-900 to-blue-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="text-2xl font-extrabold tracking-tight hover:text-indigo-200 transition-colors duration-200"
          >
            Holidaze
          </Link>

          {!user && (
            <div className="md:hidden">
              <Link
                to="/login"
                className="text-sm bg-indigo-600 px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors duration-200 font-medium"
              >
                Sign In
              </Link>
            </div>
          )}

          {user && (
            <div className="flex md:hidden items-center space-x-4">
              <div className="text-sm text-right">
                <p className="font-semibold">{user.name}</p>
                <p className="text-indigo-200 text-xs">
                  {user.venueManager ? "Admin" : "Customer"}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full"
                aria-label="Toggle mobile menu"
                aria-expanded={isOpen}
              >
                <img
                  src={user.avatar?.url || fallbackImage}
                  alt={user.avatar?.alt || `${user.name}'s avatar`}
                  className="w-10 h-10 rounded-full object-cover border-2 border-indigo-300"
                />
              </button>
            </div>
          )}

          <ul className="hidden md:flex space-x-8 items-center">
            {navMenuItems.map((item) => (
              <li key={item.url}>
                <Link
                  to={item.url}
                  className="text-indigo-100 hover:text-white hover:bg-indigo-800 px-3 py-2 rounded-md transition-all duration-200 font-medium"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {user ? (
              <li>
                <button
                  onClick={handleLogout}
                  className="text-indigo-100 hover:text-white hover:bg-indigo-800 px-3 py-2 rounded-md transition-all duration-200 font-medium cursor-pointer"
                >
                  Sign Out
                </button>
              </li>
            ) : (
              <li>
                <Link
                  to="/login"
                  className="text-indigo-100 hover:text-white hover:bg-indigo-800 px-3 py-2 rounded-md transition-all duration-200 font-medium"
                >
                  Sign In
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>

      {isOpen && user && (
        <div className="md:hidden">
          <ul className="space-y-2 px-4 py-4 bg-indigo-950/95 backdrop-blur-sm">
            {navMenuItems.map((item) => (
              <li key={item.url}>
                <Link
                  to={item.url}
                  className="block text-indigo-100 hover:text-white hover:bg-indigo-800 px-3 py-2 rounded-md transition-all duration-200 font-medium"
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
                className="w-full text-left text-indigo-100 hover:text-white hover:bg-indigo-800 px-3 py-2 rounded-md transition-all duration-200 font-medium"
              >
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default ResponsiveNav;