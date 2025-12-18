import { Outlet, ScrollRestoration } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen text-white">
      <Navbar />
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
      <footer className="glass mt-auto py-6 text-center text-white/40 text-sm">
        © 2024 BikeFlow. Alle rechten voorbehouden.
      </footer>
      <ScrollRestoration />
    </div>
  );
}
