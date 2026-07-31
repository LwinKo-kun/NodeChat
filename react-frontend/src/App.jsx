import { useState } from 'react';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <nav className="p-4 bg-white shadow flex gap-4">
        <button onClick={() => setCurrentPage('home')} className="font-semibold">Home</button>
        <button onClick={() => setCurrentPage('about')} className="font-semibold">About</button>
        <button onClick={() => setCurrentPage('contact')} className="font-semibold">Contact</button>
        <button onClick={() => setCurrentPage('not-found')} className="font-semibold">Not Found</button>
      </nav>

      <main className="max-w-4xl mx-auto mt-6">
        {currentPage === 'home' && <Home />}
        {currentPage === 'about' && <About />}
        {currentPage === 'contact' && <Contact />}
        {currentPage === 'not-found' && <NotFound />}
      </main>
    </div>
  );
}

export default App;