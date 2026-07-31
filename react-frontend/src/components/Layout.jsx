import { Outlet, Link } from 'react-router-dom'; // If using React Router, or use your state switcher

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <nav className="p-4 bg-white shadow flex gap-6 border-b border-gray-200">
        <Link to="/" className="font-semibold hover:text-blue-600">Home</Link>
        <Link to="/about" className="font-semibold hover:text-blue-600">About</Link>
        <Link to="/contact" className="font-semibold hover:text-blue-600">Contact</Link>
      </nav>

      <main className="max-w-4xl mx-auto mt-6 p-4">
        {/* Outlet renders the current matching route */}
        <Outlet />
      </main>
    </div>
  );
}