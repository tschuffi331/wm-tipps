import { useState, FormEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { login as apiLogin } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  useEffect(() => { document.title = 'Anmelden — WM Tipps 2026'; }, []);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { token, user } = await apiLogin(username, password);
      login(token, user);
      toast.success(`Willkommen, ${user.username}!`);
      navigate('/tips');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Anmeldung fehlgeschlagen';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-wm-dark mb-6 text-center">Anmelden</h1>

        <div className="flex items-center gap-2.5 bg-wm-gold/10 border border-wm-gold/40 rounded-xl px-4 py-3 mb-5">
          <span className="text-xl shrink-0" aria-hidden="true">⚽</span>
          <p className="text-sm text-gray-700">
            Die WM startet am <span className="font-semibold text-wm-dark">11. Juni 2026</span> —
            jetzt registrieren und rechtzeitig tippen!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-username" className="block text-sm font-medium text-gray-700 mb-1">Benutzername</label>
            <input
              id="login-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-wm-green"
              placeholder="Dein Benutzername"
            />
          </div>
          <div>
            <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">Passwort</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-wm-green"
              placeholder="••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-wm-green text-white font-semibold py-2.5 rounded-lg hover:bg-green-800 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Anmelden...' : 'Anmelden'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-500">
          Noch kein Konto?{' '}
          <Link to="/register" className="text-wm-green font-semibold hover:underline">
            Jetzt registrieren
          </Link>
        </p>
      </div>
    </div>
  );
}
