import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../common/Avatar';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <nav className="bg-wm-dark text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2 font-bold text-lg text-wm-gold">
          ⚽ WM Tipps 2026
        </NavLink>

        <div className="flex items-center gap-4 text-sm">
          <NavLink
            to="/leaderboard"
            className={({ isActive }) =>
              isActive ? 'text-wm-gold font-semibold' : 'text-gray-300 hover:text-white transition-colors'
            }
          >
            Rangliste
          </NavLink>

          {user ? (
            <>
              <NavLink
                to="/tips"
                className={({ isActive }) =>
                  isActive ? 'text-wm-gold font-semibold' : 'text-gray-300 hover:text-white transition-colors'
                }
              >
                Meine Tipps
              </NavLink>

              {user.role === 'admin' && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    isActive ? 'text-wm-gold font-semibold' : 'text-gray-300 hover:text-white transition-colors'
                  }
                >
                  Admin
                </NavLink>
              )}

              <NavLink to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Avatar username={user.username} avatarUrl={user.avatar_url} size={32} />
                <span className="hidden sm:inline text-gray-200">{user.username}</span>
              </NavLink>

              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-400 transition-colors text-xs"
              >
                Abmelden
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? 'text-wm-gold font-semibold' : 'text-gray-300 hover:text-white transition-colors'
                }
              >
                Anmelden
              </NavLink>
              <NavLink
                to="/register"
                className="bg-wm-gold text-wm-dark px-3 py-1 rounded font-semibold hover:bg-yellow-400 transition-colors"
              >
                Registrieren
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
