import { NavLink } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="app-navbar">
      <div className="nav-brand">NodeChat</div>
      <div className="nav-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Home
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          About
        </NavLink>
        <NavLink to="/contact" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Contact
        </NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Dashboard
        </NavLink>
      </div>
      <div className="nav-actions">
        {user ? (
          <button onClick={onLogout} className="nav-button">Logout</button>
        ) : (
          <>
            <NavLink to="/login" className="nav-button">Login</NavLink>
            <NavLink to="/register" className="nav-button nav-button-primary">Register</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
