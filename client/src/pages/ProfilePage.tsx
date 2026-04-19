import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Avatar } from '../components/common/Avatar';
import { updateAvatar, deleteAvatar } from '../api/admin';
import { changePassword } from '../api/settings';

export function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  function handleLogout() {
    logout();
    navigate('/');
  }

  const [pwOpen, setPwOpen] = useState(false);
  const [pwCurrent, setPwCurrent] = useState('');
  const [pwNew, setPwNew] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [pwSaving, setPwSaving] = useState(false);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (pwNew !== pwConfirm) {
      toast.error('Neues Passwort stimmt nicht überein');
      return;
    }
    setPwSaving(true);
    try {
      await changePassword(pwCurrent, pwNew);
      toast.success('Passwort erfolgreich geändert!');
      setPwOpen(false);
      setPwCurrent(''); setPwNew(''); setPwConfirm('');
    } catch (err: unknown) {
      toast.error(
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Fehler beim Ändern'
      );
    } finally {
      setPwSaving(false);
    }
  }

  if (!user) return null;

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const { avatar_url } = await updateAvatar(file);
      updateUser({ avatar_url });
      toast.success('Profilbild aktualisiert!');
    } catch {
      toast.error('Fehler beim Hochladen');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setLoading(true);
    try {
      const { avatar_url } = await deleteAvatar();
      updateUser({ avatar_url });
      toast.success('Profilbild entfernt – automatischer Avatar aktiv');
    } catch {
      toast.error('Fehler beim Entfernen');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-wm-dark mb-6">Mein Profil</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
        <div className="flex flex-col items-center gap-4">
          <Avatar username={user.username} avatarUrl={user.avatar_url} size={96} className="shadow-md" />
          <h2 className="text-xl font-semibold text-gray-800">{user.username}</h2>
          {user.role === 'admin' && (
            <span className="bg-wm-dark text-wm-gold px-3 py-0.5 rounded-full text-xs font-bold">Admin</span>
          )}
        </div>

        <div className="border-t pt-4 space-y-3">
          <p className="text-sm text-gray-600 text-center">
            Klicke unten, um dein Profilbild zu ändern.
            <br />
            Kein eigenes Bild → automatisch generierter Avatar.
          </p>

          <button
            onClick={() => fileRef.current?.click()}
            disabled={loading}
            className="w-full bg-wm-green text-white font-semibold py-2.5 rounded-lg hover:bg-green-800 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Laden...' : 'Neues Profilbild hochladen'}
          </button>

          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

          {user.avatar_url && !user.avatar_url.includes('dicebear') && (
            <button
              onClick={handleDelete}
              disabled={loading}
              className="w-full border border-red-300 text-red-500 font-medium py-2 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
            >
              Profilbild entfernen
            </button>
          )}
        </div>

        <div className="border-t pt-4">
          <button
            onClick={handleLogout}
            className="w-full border border-red-300 text-red-500 font-medium py-2 rounded-lg hover:bg-red-50 transition-colors"
          >
            Abmelden
          </button>
        </div>
      </div>

      {/* Passwort ändern */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mt-4">
        <button
          onClick={() => setPwOpen(o => !o)}
          className="w-full flex items-center justify-between px-6 py-4 text-left"
        >
          <span className="font-semibold text-gray-800">Passwort ändern</span>
          <span className="text-gray-400 text-lg">{pwOpen ? '▲' : '▼'}</span>
        </button>

        {pwOpen && (
          <form onSubmit={handleChangePassword} className="px-6 pb-6 space-y-3 border-t pt-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Aktuelles Passwort</label>
              <input
                type="password"
                value={pwCurrent}
                onChange={e => setPwCurrent(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-wm-green"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Neues Passwort</label>
              <input
                type="password"
                value={pwNew}
                onChange={e => setPwNew(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-wm-green"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Neues Passwort bestätigen</label>
              <input
                type="password"
                value={pwConfirm}
                onChange={e => setPwConfirm(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-wm-green"
              />
            </div>
            <button
              type="submit"
              disabled={pwSaving}
              className="w-full bg-wm-green text-white font-semibold py-2.5 rounded-lg hover:bg-green-800 disabled:opacity-50 transition-colors"
            >
              {pwSaving ? 'Speichern...' : 'Passwort speichern'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
