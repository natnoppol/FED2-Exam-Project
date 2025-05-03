import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { getUser, clearAuth } from "../utils/auth";
import { toast } from "react-toastify";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  // const [accountOpen, setAccountOpen] = useState(false);
  const navigate = useNavigate();
  const user = getUser();
  const accountRef = useRef();

  const toggleMobileMenu = () => {
    setMobileOpen((prev) => !prev);
  };

  // const toggleAccountMenu = () => {
  //   setAccountOpen((prev) => !prev);
  // };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        // setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    clearAuth();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const NavItem = ({ to, children }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
          ? "text-blue-500 font-semibold"
          : "text-gray-700 dark:text-gray-200 hover:text-blue-500 transition"
      }
      onClick={() => setMobileOpen(false)}
    >
      {children}
    </NavLink>
  );

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-white">
              Holidaze
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden sm:flex space-x-6 items-center">
            {user && <NavItem to="/profile">Profile</NavItem>}
            {user?.venueManager && (
              <>
                <NavItem to="/admin/manage-venues">Manage Venues</NavItem>
                <NavItem to="/admin/bookings">Admin Bookings</NavItem>
              </>
            )}
            {user ? (
              <button onClick={handleLogout} className="hover:text-red-400 transition">
                Sign out
              </button>
            ) : (
              <NavItem to="/login">Login</NavItem>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="sm:hidden flex items-center">
            <button onClick={toggleMobileMenu} className="p-2 text-gray-300 hover:text-white focus:outline-none">
              {mobileOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="sm:hidden bg-gray-700 px-4 pt-2 pb-4 space-y-2">
          <NavItem to="/">Home</NavItem>
          {user && <NavItem to="/profile">Profile</NavItem>}
          {user?.venueManager && (
            <>
              <NavItem to="/admin/manage-venues">Manage Venues</NavItem>
              <NavItem to="/admin/bookings">Admin Bookings</NavItem>
            </>
          )}
          {user ? (
            <button onClick={handleLogout} className="text-left w-full text-red-400 hover:text-red-300">
              Sign out
            </button>
          ) : (
            <NavItem to="/login">Login</NavItem>
          )}
        </div>
      )}
    </nav>
  );
};

export default Header;
