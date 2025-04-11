import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const getNavLinkClass = ({ isActive }) =>
    isActive
      ? "text-blue-500 font-semibold"
      : "text-gray-700 hover:text-blue-500 transition";

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="bg-white shadow-md p-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Holidaze
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6">
          <NavLink to="/" className={getNavLinkClass}>
            Home
          </NavLink>
          <NavLink to="/login" className={getNavLinkClass}>
            Login
          </NavLink>
          <NavLink to="/admin" className={getNavLinkClass}>
            Admin
          </NavLink>
        </nav>

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
        <nav id="mobile-nav" className="md:hidden bg-white border-t px-4 pb-4 space-y-3">
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
        </nav>
      )}
    </header>
  );
};

export default Header;
