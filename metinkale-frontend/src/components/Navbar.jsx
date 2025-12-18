import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/theme';
import { useAuth } from '../contexts/auth';
import { IoMoonSharp, IoSunny, IoMenu, IoClose } from 'react-icons/io5';

export default function Navbar() {
  const { isAuthed, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { to: '/home', label: 'Home' },
    { to: '/fietsen', label: 'Fietsen', auth: true },
    { to: '/locaties', label: 'Locaties', auth: true },
    { to: '/verhuur', label: 'Verhuur', auth: true },
    { to: '/feedback', label: 'Feedback', auth: true },
    { to: '/about', label: 'Over Ons' },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="sticky top-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#F7C948] flex items-center justify-center">
              <span className="text-white font-bold text-xl">🚴</span>
            </div>
            <span className="font-display text-xl font-bold gradient-text hidden sm:block">
              BikeFlow
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              if (link.auth && !isAuthed) return null;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive(link.to)
                      ? 'bg-gradient-to-r from-[#FF6B35]/20 to-[#F7C948]/20 text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all"
            >
              {theme === 'dark' ? <IoSunny className="w-5 h-5" /> : <IoMoonSharp className="w-5 h-5" />}
            </button>

            {isAuthed ? (
              <>
                <Link to="/profile" className="hidden md:flex items-center gap-2 text-white/60 hover:text-white">
                  <img
                    src={user?.profielfoto || '/images/default.jpg'}
                    alt="Profiel"
                    className="w-8 h-8 rounded-full object-cover border-2 border-[#FF6B35]"
                  />
                </Link>
                <Link to="/logout" className="hidden md:block btn-secondary text-sm py-2">
                  Uitloggen
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="hidden md:block btn-secondary text-sm py-2">
                  Inloggen
                </Link>
                <Link to="/register" className="hidden md:block btn-primary text-sm py-2">
                  Registreren
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-white/60 hover:text-white"
            >
              {isOpen ? <IoClose className="w-6 h-6" /> : <IoMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            {links.map((link) => {
              if (link.auth && !isAuthed) return null;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 rounded-xl"
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="flex gap-2 mt-4 px-4">
              {isAuthed ? (
                <Link to="/logout" onClick={() => setIsOpen(false)} className="btn-secondary flex-1 text-center text-sm py-2">
                  Uitloggen
                </Link>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="btn-secondary flex-1 text-center text-sm py-2">
                    Inloggen
                  </Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="btn-primary flex-1 text-center text-sm py-2">
                    Registreren
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
