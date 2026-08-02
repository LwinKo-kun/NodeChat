import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout({ user, onLogout }) {
  return (
    <div className="app-shell">
      <Navbar user={user} onLogout={onLogout} />
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}
