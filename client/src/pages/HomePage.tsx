import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchMatches } from '../api/matches';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import type { Match } from '../types';

const GROUPS = ['A','B','C','D','E','F','G','H','I','J','K','L'];
const TOURNAMENT_START = new Date('2026-06-11T21:00:00Z');

export function HomePage() {
  const { user } = useAuth();
  const { data: matches, isLoading } = useQuery({
    queryKey: ['matches'],
    queryFn: () => fetchMatches(),
  });

  if (isLoading) return <LoadingSpinner message="Turnierplan wird geladen..." />;

  const groupMap: Record<string, Match[]> = {};
  for (const m of matches ?? []) {
    if (!groupMap[m.group_name]) groupMap[m.group_name] = [];
    groupMap[m.group_name].push(m);
  }

  const now = new Date();
  const tournamentStarted = now >= TOURNAMENT_START;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Hero */}
      <div className="bg-gradient-to-r from-wm-dark to-wm-green rounded-2xl text-white p-8 mb-8 shadow-xl">
        <div className="max-w-2xl">
          <div className="text-4xl mb-2">⚽</div>
          <h1 className="text-3xl font-bold mb-2">FIFA Weltmeisterschaft 2026</h1>
          <p className="text-green-100 mb-1">USA · Kanada · Mexiko</p>
          <p className="text-green-200 text-sm mb-1">
            {tournamentStarted
              ? 'Das Turnier läuft!'
              : `Startet in ${formatDistanceToNow(TOURNAMENT_START, { locale: de })
                  .replace(/\bMonate(?!n)/g, 'Monaten')
                  .replace(/\bTage(?!n)/g, 'Tagen')}`}
          </p>
          <div className="flex items-center gap-4 text-xs text-green-300 mb-4">
            <span title="Maple — Kanadischer Elch (Kanada)">🫎 Maple</span>
            <span title="Zayu — Jaguar (Mexiko)">🐆 Zayu</span>
            <span title="Clutch — Weißkopfseeadler (USA)">🦅 Clutch</span>
          </div>

          {user ? (
            <Link
              to="/tips"
              className="inline-block bg-wm-gold text-wm-dark font-bold px-6 py-2.5 rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Zu meinen Tipps →
            </Link>
          ) : (
            <div className="flex gap-3 flex-wrap">
              <Link
                to="/register"
                className="inline-block bg-wm-gold text-wm-dark font-bold px-6 py-2.5 rounded-lg hover:bg-yellow-400 transition-colors"
              >
                Jetzt mitmachen →
              </Link>
              <Link
                to="/login"
                className="inline-block bg-white/10 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-white/20 transition-colors"
              >
                Anmelden
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Group overview */}
      <h2 className="text-xl font-bold text-wm-dark mb-4">Gruppen — Vorrunde</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {GROUPS.map((g) => {
          const gMatches = groupMap[g] ?? [];
          const teams = Array.from(
            new Map(
              gMatches.flatMap((m) => [
                [m.home_team.id, m.home_team],
                [m.away_team.id, m.away_team],
              ])
            ).values()
          );

          return (
            <div key={g} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-wm-dark">Gruppe {g}</h3>
                <span className="text-xs text-gray-400">{gMatches.length} Spiele</span>
              </div>
              <ul className="space-y-1.5">
                {teams.map((t) => (
                  <li key={t.id} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-lg">{t.flag_emoji ?? ''}</span>
                    <span>{t.name}</span>
                    <span className="text-gray-400 text-xs ml-auto">{t.short_name}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
