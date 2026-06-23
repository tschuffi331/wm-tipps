import { useState, useEffect, useRef } from 'react';
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
  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const hasScrolled = useRef(false);

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

  // Scroll to today's first match (or next upcoming) on initial load.
  // Must be before any conditional return to satisfy Rules of Hooks.
  // cardRefs is empty while loading (no cards rendered), so the effect
  // safely no-ops until the loading spinner is replaced by actual cards.
  useEffect(() => {
    if (hasScrolled.current || !matches?.length) return;
    const phase: WmPhase = userPhase ?? adminPhase ?? 'Vorrunde';
    const forPhase = matches.filter(m => matchBelongsToPhase(m.group_name, phase));
    const todayStr = new Date().toDateString();
    const target =
      forPhase.find(m => new Date(m.kickoff_utc).toDateString() === todayStr) ??
      forPhase.find(m => new Date(m.kickoff_utc) > new Date());
    if (!target) return;
    const el = cardRefs.current[target.id];
    if (!el) return;
    hasScrolled.current = true;
    setTimeout(() => {
      const top = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    }, 80);
  });

  if (matchesLoading || tipsLoading || phaseLoading) {
    return <LoadingSpinner message="Spiele werden geladen..." />;
  }

  const tipMap: Record<number, Tip> = {};
  for (const t of myTips ?? []) tipMap[t.match_id] = t;
  for (const [k, v] of Object.entries(localTips)) tipMap[Number(k)] = v;

  // Effective phase: user selection overrides admin default
  const currentPhase: WmPhase = userPhase ?? adminPhase ?? 'Vorrunde';

  // Info-only: whether the user is viewing a phase that isn't the admin's active one.
  // We no longer lock tipping based on phase — only kickoff time (isPast in MatchCard) controls that.
  const isViewingNonActivePhase = adminPhase !== undefined && currentPhase !== adminPhase;

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

          {WM_PHASES.map((phase) => {
            const adminIdx   = adminPhase ? WM_PHASES.indexOf(adminPhase) : 0;
            const phaseIdx   = WM_PHASES.indexOf(phase);
            const isFuture   = phaseIdx > adminIdx;
            return (
              <option key={phase} value={phase} disabled={isFuture}>
                {phase === adminPhase ? `${phase} ✓` : isFuture ? `${phase} (noch nicht geöffnet)` : phase}
              </option>
            );
          })}

        </select>
        {isViewingNonActivePhase && (
          <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1">
            Aktive Phase: {adminPhase}
          </span>
        )}
      </div>

      {/* Group filter — only visible for Vorrunde */}
      {currentPhase === 'Vorrunde' && (
        <div className="mb-5 overflow-x-auto pb-1">
          <GroupFilter selected={selectedGroup} onChange={setSelectedGroup} />
        </div>
      )}

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-500 py-12">Keine Spiele gefunden.</p>
        ) : (
          filtered.map((match) => (
            <div key={match.id} ref={(el) => { cardRefs.current[match.id] = el; }}>
              <MatchCard
                match={match}
                tip={tipMap[match.id]}
                onTipSaved={handleTipSaved}
                isLoggedIn={!!user}
                readOnly={false}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
