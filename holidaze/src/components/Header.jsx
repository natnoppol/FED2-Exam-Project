import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, User } from "lucide-react";
import { getUser, clearAuth } from "../utils/auth";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const getNavLinkClass = ({ isActive }) =>
    isActive
      ? "text-blue-500 font-semibold"
      : "text-gray-700 hover:text-blue-500 transition";

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleAccount = () => setAccountOpen(!accountOpen);

  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    clearAuth();  // Clear user data
    navigate('/login'); // Redirect to login page (or home)
  };

  return (
    <header className="bg-white shadow-md p-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Holidaze
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-6 items-center">
          <NavLink to="/" className={getNavLinkClass}>
            Home
          </NavLink>
          <NavLink to="/login" className={getNavLinkClass}>
            Login
          </NavLink>
          <NavLink to="/admin" className={getNavLinkClass}>
            Admin
          </NavLink>

          {/* Account Dropdown */}
          {user && (
            <div className="relative">
              <button
                onClick={toggleAccount}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-500"
              >
                <User className="w-5 h-5" />
                <span>{user?.name}</span>
              </button>
              {accountOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg py-2 z-10">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/admin/manage-venues"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Manage Venues
                  </Link>
                  <Link
                    to="/admin/bookings"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Manage Bookings
                  </Link>
                  
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={handleLogout} // Use consistent logout method
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav Menu */}
      {menuOpen && (
        <nav
          id="mobile-nav"
          className="md:hidden bg-white border-t px-4 pb-4 space-y-3"
        >
          <NavLink
            to="/"
            className={getNavLinkClass}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/login"
            className={getNavLinkClass}
            onClick={() => setMenuOpen(false)}
          >
            Login
          </NavLink>
          <NavLink
            to="/admin"
            className={getNavLinkClass}
            onClick={() => setMenuOpen(false)}
          >
            Admin
          </NavLink>
          {user && (
            <div className="pt-2 border-t">
              <p className="text-sm font-medium text-gray-700 mb-1">
                {user.name}
              </p>
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="block text-gray-700 hover:text-blue-500"
              >
                Profile
              </Link>
              <Link
                to="/admin/manage-venues"
                onClick={() => setMenuOpen(false)}
                className="block text-gray-700 hover:text-blue-500"
              >
                Manage Venues
              </Link>
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="block text-gray-700 hover:text-blue-500 mt-1">Logout</button>
            </div>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
