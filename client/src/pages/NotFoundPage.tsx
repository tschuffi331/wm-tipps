import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center px-4">
      <div className="text-6xl">⚽</div>
      <h1 className="text-3xl font-bold text-wm-dark">Seite nicht gefunden</h1>
      <p className="text-gray-500">Diese Seite existiert nicht – vielleicht war's Abseits?</p>
      <Link to="/" className="bg-wm-green text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-green-800 transition-colors">
        Zur Startseite
      </Link>
    </div>
  );
}
