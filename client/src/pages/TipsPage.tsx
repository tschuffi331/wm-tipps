import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMatches } from '../api/matches';
import { fetchMyTips } from '../api/tips';
import { getPublicPhase } from '../api/settings';
import { MatchCard } from '../components/matches/MatchCard';
import { GroupFilter } from '../components/matches/GroupFilter';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { WM_PHASES } from '../types';
import type { Tip, WmPhase } from '../types';

const GROUP_STAGE = ['A','B','C','D','E','F','G','H','I','J','K','L'];

function matchBelongsToPhase(groupName: string, phase: WmPhase): boolean {
  if (phase === 'Vorrunde') return GROUP_STAGE.includes(groupName);
  return groupName === phase;
}

export function TipsPage() {
  useEffect(() => { document.title = 'Meine Tipps — WM Tipps 2026'; }, []);
  const { user } = useAuth();
  const [selectedGroup, setSelectedGroup] = useState('ALL');
  const [userPhase, setUserPhase] = useState<WmPhase | null>(null);

  const { data: adminPhase, isLoading: phaseLoading } = useQuery({
    queryKey: ['publicPhase'],
    queryFn: getPublicPhase,
  });

  const { data: matches, isLoading: matchesLoading } = useQuery({
    queryKey: ['matches'],
    queryFn: () => fetchMatches(),
  });

  const { data: myTips, isLoading: tipsLoading } = useQuery({
    queryKey: ['myTips'],
    queryFn: fetchMyTips,
    enabled: !!user,
  });

  const [localTips, setLocalTips] = useState<Record<number, Tip>>({});

  function handleTipSaved(tip: Tip) {
    setLocalTips((prev) => ({ ...prev, [tip.match_id]: tip }));
  }

  if (matchesLoading || tipsLoading || phaseLoading) {
    return <LoadingSpinner message="Spiele werden geladen..." />;
  }

  const tipMap: Record<number, Tip> = {};
  for (const t of myTips ?? []) tipMap[t.match_id] = t;
  for (const [k, v] of Object.entries(localTips)) tipMap[Number(k)] = v;

  // Effective phase: user selection overrides admin default
  const currentPhase: WmPhase = userPhase ?? adminPhase ?? 'Vorrunde';

  // Matches are read-only (grayed) when viewing a phase ≠ admin's current phase
  const isReadOnly = adminPhase !== undefined && currentPhase !== adminPhase;

  // Filter by phase, then by group (only relevant for Vorrunde)
  const filteredByPhase = (matches ?? []).filter(
    (m) => matchBelongsToPhase(m.group_name, currentPhase)
  );
  const filtered = filteredByPhase.filter(
    (m) => currentPhase !== 'Vorrunde' || selectedGroup === 'ALL' || m.group_name === selectedGroup
  );

  const tippedCount  = Object.keys(tipMap).length;
  const totalMatches = matches?.length ?? 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-wm-dark mb-1">Meine Tipps</h1>
        {user && (
          <p className="text-sm text-gray-500">
            {tippedCount} von {totalMatches} Spielen getippt
          </p>
        )}
      </div>

      {/* Phase selector */}
      <div className="flex items-center gap-3 mb-4">
        <label htmlFor="phase-select" className="text-sm font-medium text-gray-700 shrink-0">
          WM-Phase
        </label>
        <select
          id="phase-select"
          value={currentPhase}
          onChange={(e) => {
            setUserPhase(e.target.value as WmPhase);
            setSelectedGroup('ALL');
          }}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-wm-green"
        >
          {WM_PHASES.map((phase) => (
            <option key={phase} value={phase}>
              {phase}{phase === adminPhase ? ' ✓' : ''}
            </option>
          ))}
        </select>
        {isReadOnly && (
          <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1">
            Nur Ansicht — aktive Phase ist {adminPhase}
          </span>
        )}
      </div>

      {/* Group filter — only visible for Vorrunde */}
      {currentPhase === 'Vorrunde' && (
        <div className="mb-5 overflow-x-auto pb-1">
          <GroupFilter selected={selectedGroup} onChange={setSelectedGroup} />
        </div>
      )}

      <div className={`space-y-3 ${isReadOnly ? 'opacity-50 pointer-events-none' : ''}`}>
        {filtered.length === 0 ? (
          <p className="text-center text-gray-500 py-12">Keine Spiele gefunden.</p>
        ) : (
          filtered.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              tip={tipMap[match.id]}
              onTipSaved={handleTipSaved}
              isLoggedIn={!!user}
              readOnly={isReadOnly}
            />
          ))
        )}
      </div>
    </div>
  );
}
