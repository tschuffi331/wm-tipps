import { useState, FormEvent, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { register as apiRegister } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { Avatar } from '../components/common/Avatar';

export function RegisterPage() {
  useEffect(() => { document.title = 'Registrieren — WM Tipps 2026'; }, []);
  const [username, setUsername]   = useState('');
  const [password, setPassword]   = useState('');
  const [password2, setPassword2] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [preview, setPreview]     = useState<string | null>(null);
  const [loading, setLoading]     = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { login } = useAuth();
  const navigate  = useNavigate();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password !== password2) { toast.error('Passwörter stimmen nicht überein'); return; }
    setLoading(true);
    try {
      const { token, user } = await apiRegister(username, password, avatarFile ?? undefined);
      login(token, user);
      toast.success(`Willkommen, ${user.username}!`);
      navigate('/tips');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Registrierung fehlgeschlagen';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-wm-dark mb-6 text-center">Registrieren</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar upload */}
          <div className="flex flex-col items-center gap-3">
            <div
              className="cursor-pointer rounded-full overflow-hidden border-4 border-dashed border-gray-300 hover:border-wm-green transition-colors"
              onClick={() => fileRef.current?.click()}
            >
              {preview ? (
                <img src={preview} alt="Vorschau" className="w-24 h-24 object-cover rounded-full" />
              ) : (
                <Avatar username={username || 'Vorschau'} avatarUrl={null} size={96} />
              )}
            </div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="text-sm text-wm-green hover:underline"
            >
              {avatarFile ? avatarFile.name : 'Profilbild auswählen (optional)'}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            {!avatarFile && (
              <p className="text-xs text-gray-500 text-center">
                Kein Bild → automatisch generierter Avatar
              </p>
            )}
          </div>

          <div>
            <label htmlFor="reg-username" className="block text-sm font-medium text-gray-700 mb-1">Benutzername</label>
            <input
              id="reg-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              maxLength={30}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-wm-green"
              placeholder="3–30 Zeichen"
            />
          </div>
          <div>
            <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 mb-1">Passwort</label>
            <input
              id="reg-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-wm-green"
              placeholder="Mindestens 6 Zeichen"
            />
          </div>
          <div>
            <label htmlFor="reg-password2" className="block text-sm font-medium text-gray-700 mb-1">Passwort wiederholen</label>
            <input
              id="reg-password2"
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
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
            {loading ? 'Registrieren...' : 'Konto erstellen'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-500">
          Bereits ein Konto?{' '}
          <Link to="/login" className="text-wm-green font-semibold hover:underline">
            Anmelden
          </Link>
        </p>
      </div>
    </div>
  );
}
