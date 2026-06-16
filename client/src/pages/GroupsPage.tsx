import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMatches } from '../api/matches';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import type { Match } from '../types';

const GROUPS = ['A','B','C','D','E','F','G','H','I','J','K','L'];

export function GroupsPage() {
  useEffect(() => { document.title = 'Gruppen der Vorrunde — WM Tipps 2026'; }, []);

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

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold text-wm-dark mb-4">Gruppen — Vorrunde</h1>
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
                <span className="text-xs text-gray-500">{gMatches.length} Spiele</span>
              </div>
              <ul className="space-y-1.5">
                {teams.map((t) => (
                  <li key={t.id} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-lg" aria-hidden="true">{t.flag_emoji ?? ''}</span>
                    <span>{t.name}</span>
                    <span className="text-gray-500 text-xs ml-auto">{t.short_name}</span>
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
