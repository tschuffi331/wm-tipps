import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMatches } from '../api/matches';
import { fetchMyTips } from '../api/tips';
import { MatchCard } from '../components/matches/MatchCard';
import { GroupFilter } from '../components/matches/GroupFilter';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import type { Tip } from '../types';

export function TipsPage() {
  const { user } = useAuth();
  const [selectedGroup, setSelectedGroup] = useState('ALL');

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

  if (matchesLoading || tipsLoading) return <LoadingSpinner message="Spiele werden geladen..." />;

  const tipMap: Record<number, Tip> = {};
  for (const t of myTips ?? []) tipMap[t.match_id] = t;
  for (const [k, v] of Object.entries(localTips)) tipMap[Number(k)] = v;

  const filtered = (matches ?? []).filter(
    (m) => selectedGroup === 'ALL' || m.group_name === selectedGroup
  );

  const tippedCount  = Object.keys(tipMap).length;
  const totalMatches = 72;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-wm-dark mb-1">Meine Tipps</h1>
        {user && (
          <p className="text-sm text-gray-500">
            {tippedCount} von {totalMatches} Spielen getippt
          </p>
        )}
      </div>

      <div className="mb-5 overflow-x-auto pb-1">
        <GroupFilter selected={selectedGroup} onChange={setSelectedGroup} />
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-12">Keine Spiele gefunden.</p>
        ) : (
          filtered.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              tip={tipMap[match.id]}
              onTipSaved={handleTipSaved}
              isLoggedIn={!!user}
            />
          ))
        )}
      </div>
    </div>
  );
}
