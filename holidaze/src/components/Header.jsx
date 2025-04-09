import { Link } from 'react-router-dom';

const Header = () => (
  <nav>
    <Link to="/">Home</Link>
    <Link to="/login">Login</Link>
    <Link to="/admin">Admin Dashboard</Link>
  </nav>
);

export default Header;