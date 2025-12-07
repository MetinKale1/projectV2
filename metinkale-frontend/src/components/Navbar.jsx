// src/components/Navbar.jsx
// ...existing code...
import { useTheme } from '../contexts/theme';
import { IoMoonSharp, IoSunny } from 'react-icons/io5';
import { useAuth } from '../contexts/auth';
import { Link } from 'react-router-dom';
export default function Navbar() {
  const { isAuthed, user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className={`navbar sticky-top bg-${theme} text-bg-${theme} mb-4`}>
      <div className="container-fluid flex-column flex-sm-row align-items-start align-items-sm-center">
        <div className="nav-item my-2 mx-sm-3 my-sm-0">
          <Link className="nav-link" to="/home">
            Home
          </Link>
        </div>
        <div className="nav-item my-2 mx-sm-3 my-sm-0">
          <Link className="nav-link" to="/feedback">
            Feedback
          </Link>
        </div>
        <div className="nav-item my-2 mx-sm-3 my-sm-0">
          <Link className="nav-link" to="/fietsen">
            Fietsen
          </Link>
        </div>
        <div className="nav-item my-2 mx-sm-3 my-sm-0">
          <Link className="nav-link" to="/locaties">
            Locaties
          </Link>
        </div>
        <div className="nav-item my-2 mx-sm-3 my-sm-0">
          <Link className="nav-link" to="/verhuur">
            Verhuur
          </Link>
        </div>
        <div className="nav-item my-2 mx-sm-3 my-sm-0">
          <Link className="nav-link" to="/about">
            Over ons
          </Link>
        </div>
        {!isAuthed && (
          <div className="nav-item my-2 mx-sm-3 my-sm-0">
            <Link className="nav-link" to="/register">
              register
            </Link>
          </div>
        )}
        {
          // 👇 2
          isAuthed ? (
            // 👇 3
            <div className='nav-item my-2 mx-sm-3 my-sm-0'>
              <Link className='nav-link' to='/logout' data-cy="logout_btn">
                Logout
              </Link>
            </div>
          ) : (
            // 👇 4
            <div className='nav-item my-2 mx-sm-3 my-sm-0'>
              <Link className='nav-link' to='/login'>
                Login
              </Link>
            </div>
          )
        }
        <button
          className='btn btn-secondary'
          type='button'
          onClick={toggleTheme}
        >
          {theme === 'dark' ? <IoMoonSharp /> : <IoSunny />}
        </button>
        {isAuthed && (
          <Link to="/profile" className="nav-link" style={{ padding: 0, marginLeft: 16 }}>
            <img
              src={user?.profielfoto || '/images/default.jpg'}
              alt="Profielfoto"
              style={{ width: 40, height: 40, borderRadius: '50%' }}
            />
          </Link>
        )}
        <div className="flex-grow-1"></div>
      </div>
    </nav>
  );
}
