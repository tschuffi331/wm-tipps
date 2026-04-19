import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../common/Avatar';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function close() { setOpen(false); }

  function handleLogout() {
    logout();
    navigate('/');
    close();
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'text-wm-gold font-semibold' : 'text-gray-300 hover:text-white transition-colors';

  return (
    <nav className="bg-wm-dark text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">

        {/* Logo */}
        <NavLink to="/" onClick={close} className="font-bold text-wm-gold hover:opacity-90 transition-opacity text-lg whitespace-nowrap">
          WM Tipps 2026
        </NavLink>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-4 text-sm">
          <NavLink to="/leaderboard" className={linkClass}>Rangliste</NavLink>
          <NavLink to="/rules"       className={linkClass}>Regeln</NavLink>

          {user ? (
            <>
              <NavLink to="/tips"    className={linkClass}>Meine Tipps</NavLink>
              {user.role === 'admin' && (
                <NavLink to="/admin" className={linkClass}>Admin</NavLink>
              )}
              <NavLink to="/profile" className="flex items-center hover:opacity-80 transition-opacity">
                <Avatar username={user.username} avatarUrl={user.avatar_url} size={32} />
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/login"    className={linkClass}>Anmelden</NavLink>
              <NavLink to="/register" className="bg-wm-gold text-wm-dark px-3 py-1 rounded font-semibold hover:bg-yellow-400 transition-colors">
                Registrieren
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile right side: avatar + hamburger */}
        <div className="flex sm:hidden items-center gap-3">
          {user && (
            <NavLink to="/profile" onClick={close} className="flex items-center hover:opacity-80 transition-opacity">
              <Avatar username={user.username} avatarUrl={user.avatar_url} size={30} />
            </NavLink>
          )}
          <button
            onClick={() => setOpen(o => !o)}
            className="p-1.5 rounded-md text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Menü"
          >
            {open ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="sm:hidden bg-wm-dark border-t border-white/10 px-4 py-3 flex flex-col gap-3 text-sm">
          <NavLink to="/leaderboard" onClick={close} className={linkClass}>Rangliste</NavLink>
          <NavLink to="/rules"       onClick={close} className={linkClass}>Regeln</NavLink>

          {user ? (
            <>
              <NavLink to="/tips"    onClick={close} className={linkClass}>Meine Tipps</NavLink>
              {user.role === 'admin' && (
                <NavLink to="/admin" onClick={close} className={linkClass}>Admin</NavLink>
              )}
              <NavLink to="/profile" onClick={close} className={linkClass}>Mein Profil</NavLink>
              <button onClick={handleLogout} className="text-left text-red-400 hover:text-red-300 transition-colors">
                Abmelden
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login"    onClick={close} className={linkClass}>Anmelden</NavLink>
              <NavLink to="/register" onClick={close} className={linkClass}>Registrieren</NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
