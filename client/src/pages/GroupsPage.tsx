import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMatches } from '../api/matches';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import type { Match, Team } from '../types';

const GROUPS = ['A','B','C','D','E','F','G','H','I','J','K','L'];

interface TeamStats {
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

function calcStandings(gMatches: Match[]): TeamStats[] {
  const statsMap = new Map<number, TeamStats>();

  const ensureTeam = (team: Team) => {
    if (team.id == null) return;
    if (!statsMap.has(team.id)) {
      statsMap.set(team.id, { team, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 });
    }
  };

  for (const m of gMatches) {
    ensureTeam(m.home_team);
    ensureTeam(m.away_team);

    if (m.home_goals == null || m.away_goals == null || m.home_team.id == null || m.away_team.id == null) continue;

    const h = statsMap.get(m.home_team.id)!;
    const a = statsMap.get(m.away_team.id)!;

    h.played++; a.played++;
    h.goalsFor += m.home_goals; h.goalsAgainst += m.away_goals;
    a.goalsFor += m.away_goals; a.goalsAgainst += m.home_goals;

    if (m.home_goals > m.away_goals) {
      h.won++; h.points += 3; a.lost++;
    } else if (m.home_goals < m.away_goals) {
      a.won++; a.points += 3; h.lost++;
    } else {
      h.drawn++; h.points++; a.drawn++; a.points++;
    }
  }

  return Array.from(statsMap.values()).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    const gdDiff = (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst);
    if (gdDiff !== 0) return gdDiff;
    return b.goalsFor - a.goalsFor;
  });
}

// Qualification status per position (2026 WC: top 2 direct, best 8 third-place teams)
function qualStatus(pos: number): 'direct' | 'maybe' | 'out' {
  if (pos <= 2) return 'direct';
  if (pos === 3) return 'maybe';
  return 'out';
}

export function GroupsPage() {
  useEffect(() => { document.title = 'Gruppen der Vorrunde — WM Tipps 2026'; }, []);

  const { data: matches, isLoading } = useQuery({
    queryKey: ['matches'],
    queryFn: () => fetchMatches(),
  });

  if (isLoading) return <LoadingSpinner message="Turnierplan wird geladen..." />;

  const groupMap: Record<string, Match[]> = {};
  for (const m of matches ?? []) {
    if (GROUPS.includes(m.group_name)) {
      if (!groupMap[m.group_name]) groupMap[m.group_name] = [];
      groupMap[m.group_name].push(m);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h1 className="text-xl font-bold text-wm-dark">Gruppen — Vorrunde</h1>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-wm-green inline-block shrink-0" />
            Sechzehntelfinale sicher
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block shrink-0" />
            evtl. als Gruppendritter
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {GROUPS.map((g) => {
          const gMatches = groupMap[g] ?? [];
          const standings = calcStandings(gMatches);
          const played = gMatches.filter(m => m.home_goals != null).length;

          return (
            <div key={g} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-wm-dark">Gruppe {g}</h3>
                <span className="text-xs text-gray-500">{played}/{gMatches.length} Spiele</span>
              </div>

              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-400 border-b border-gray-100">
                    <th className="pb-1.5 font-medium text-left w-5">#</th>
                    <th className="pb-1.5 font-medium text-left">Team</th>
                    <th className="pb-1.5 font-medium text-right w-7">Sp</th>
                    <th className="pb-1.5 font-medium text-right w-7">Td</th>
                    <th className="pb-1.5 font-medium text-right w-8">Pkt</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((s, i) => {
                    const qual = qualStatus(i + 1);
                    const gd = s.goalsFor - s.goalsAgainst;
                    const posColor =
                      qual === 'direct' ? 'text-wm-green font-bold' :
                      qual === 'maybe'  ? 'text-amber-500 font-semibold' :
                      'text-gray-400';
                    const nameColor =
                      qual === 'direct' ? 'font-semibold text-gray-800' :
                      qual === 'maybe'  ? 'text-gray-700' :
                      'text-gray-400';
                    const pktColor =
                      qual === 'direct' ? 'text-wm-dark font-bold' :
                      qual === 'maybe'  ? 'text-gray-700 font-semibold' :
                      'text-gray-400 font-medium';
                    const rowBg =
                      qual === 'direct' ? 'bg-green-50/60' :
                      qual === 'maybe'  ? 'bg-amber-50/60' : '';

                    return (
                      <tr key={s.team.id} className={`border-b border-gray-50 last:border-0 ${rowBg}`}>
                        <td className={`py-1.5 pl-1 text-xs ${posColor}`}>{i + 1}</td>
                        <td className="py-1.5 min-w-0">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-base shrink-0" aria-hidden="true">
                              {s.team.flag_emoji ?? ''}
                            </span>
                            <span
                              className={`text-xs truncate ${nameColor}`}
                              title={s.team.name}
                            >
                              {s.team.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-1.5 text-right text-xs text-gray-500 tabular-nums">{s.played}</td>
                        <td className={`py-1.5 text-right text-xs tabular-nums ${gd > 0 ? 'text-green-600' : gd < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                          {gd > 0 ? `+${gd}` : gd}
                        </td>
                        <td className={`py-1.5 pr-1 text-right tabular-nums text-xs ${pktColor}`}>
                          {s.points}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
}
