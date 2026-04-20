import { useState, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { fetchAdminMatches, setMatchResult } from '../api/admin';
import { getPasswordRules, updatePasswordRules } from '../api/settings';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import type { Match, PasswordRules } from '../types';

export function AdminPage() {
  useEffect(() => { document.title = 'Admin — WM Tipps 2026'; }, []);
  const queryClient = useQueryClient();
  const { data: matches, isLoading } = useQuery({
    queryKey: ['adminMatches'],
    queryFn: fetchAdminMatches,
  });

  const [editing, setEditing] = useState<{ matchId: number; home: string; away: string } | null>(null);
  const [saving, setSaving] = useState(false);

  // Password rules
  const { data: pwRules } = useQuery<PasswordRules>({
    queryKey: ['pwRules'],
    queryFn: getPasswordRules,
  });
  const [pwDraft, setPwDraft] = useState<PasswordRules | null>(null);
  const rules = pwDraft ?? pwRules;

  const savePwRules = useMutation({
    mutationFn: (r: PasswordRules) => updatePasswordRules(r),
    onSuccess: (saved) => {
      queryClient.setQueryData(['pwRules'], saved);
      setPwDraft(null);
      toast.success('Passwortregeln gespeichert');
    },
    onError: () => toast.error('Fehler beim Speichern'),
  });

  function startEdit(match: Match) {
    setEditing({
      matchId: match.id,
      home:    match.home_goals != null ? String(match.home_goals) : '',
      away:    match.away_goals != null ? String(match.away_goals) : '',
    });
  }

  async function saveResult() {
    if (!editing) return;
    const h = Number(editing.home);
    const a = Number(editing.away);
    if (!Number.isInteger(h) || h < 0 || !Number.isInteger(a) || a < 0) {
      toast.error('Ungültiges Ergebnis');
      return;
    }
    setSaving(true);
    try {
      await setMatchResult(editing.matchId, h, a);
      toast.success('Ergebnis gespeichert & Punkte neu berechnet!');
      setEditing(null);
      await queryClient.invalidateQueries({ queryKey: ['adminMatches'] });
      await queryClient.invalidateQueries({ queryKey: ['matches'] });
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Fehler');
    } finally {
      setSaving(false);
    }
  }

  if (isLoading) return <LoadingSpinner message="Spiele werden geladen..." />;

  const grouped: Record<string, Match[]> = {};
  for (const m of matches ?? []) {
    if (!grouped[m.group_name]) grouped[m.group_name] = [];
    grouped[m.group_name].push(m);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-wm-dark mb-2">Admin — Ergebnisse eintragen</h1>
      <p className="text-sm text-gray-500 mb-6">
        Klicke auf ein Spiel, um das Ergebnis einzutragen. Punkte werden sofort neu berechnet.
      </p>

      {/* Passwortregeln */}
      {rules && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-8">
          <h2 className="text-base font-bold text-wm-dark mb-4">Passwortregeln</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="text-sm text-gray-700 w-44 shrink-0">Mindestlänge</label>
              <input
                type="number" min={1} max={64}
                value={rules.minLength}
                onChange={e => setPwDraft({ ...(rules), minLength: Number(e.target.value) })}
                className="w-20 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-wm-green"
              />
              <span className="text-sm text-gray-500">Zeichen</span>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={rules.requireDigit}
                onChange={e => setPwDraft({ ...(rules), requireDigit: e.target.checked })}
                className="w-4 h-4 accent-wm-green"
              />
              <span className="text-sm text-gray-700">Mindestens eine Ziffer (0–9) erforderlich</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={rules.requireSpecial}
                onChange={e => setPwDraft({ ...(rules), requireSpecial: e.target.checked })}
                className="w-4 h-4 accent-wm-green"
              />
              <span className="text-sm text-gray-700">Mindestens ein Sonderzeichen erforderlich</span>
            </label>
          </div>
          {pwDraft && (
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => savePwRules.mutate(pwDraft)}
                disabled={savePwRules.isPending}
                className="px-4 py-1.5 bg-wm-green text-white text-sm font-semibold rounded-lg hover:bg-green-800 disabled:opacity-50 transition-colors"
              >
                {savePwRules.isPending ? 'Speichern...' : 'Speichern'}
              </button>
              <button
                onClick={() => setPwDraft(null)}
                className="px-4 py-1.5 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors"
              >
                Abbrechen
              </button>
            </div>
          )}
        </div>
      )}

      {/* Spielergebnisse */}

      {Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([group, groupMatches]) => (
        <div key={group} className="mb-8">
          <h2 className="text-lg font-bold text-wm-dark mb-3 flex items-center gap-2">
            <span className="bg-wm-dark text-wm-gold px-2.5 py-0.5 rounded-md text-sm">Gruppe {group}</span>
          </h2>
          <div className="space-y-2">
            {groupMatches.map((match) => {
              const isEditing = editing?.matchId === match.id;
              const kickoff = new Date(match.kickoff_utc);
              return (
                <div
                  key={match.id}
                  className={`bg-white rounded-xl border px-4 py-3 flex items-center justify-between gap-4 ${
                    isEditing ? 'border-wm-green shadow-md' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800">
                      {match.home_team.flag_emoji} {match.home_team.name} — {match.away_team.name} {match.away_team.flag_emoji}
                    </div>
                    <div className="text-xs text-gray-500">
                      {format(kickoff, 'dd. MMM yyyy · HH:mm', { locale: de })} · {match.venue ?? ''}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {match.status === 'finished' && !isEditing && (
                      <span className="text-lg font-bold text-wm-dark">
                        {match.home_goals} : {match.away_goals}
                      </span>
                    )}

                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number" min={0} max={99}
                          value={editing.home}
                          onChange={(e) => setEditing({ ...editing, home: e.target.value })}
                          className="w-12 text-center border-2 border-wm-green rounded-lg py-1 font-bold"
                        />
                        <span className="text-gray-500 font-bold">:</span>
                        <input
                          type="number" min={0} max={99}
                          value={editing.away}
                          onChange={(e) => setEditing({ ...editing, away: e.target.value })}
                          className="w-12 text-center border-2 border-wm-green rounded-lg py-1 font-bold"
                        />
                        <button
                          onClick={saveResult}
                          disabled={saving}
                          className="px-3 py-1.5 bg-wm-green text-white text-xs font-bold rounded-lg hover:bg-green-800 disabled:opacity-50"
                        >
                          {saving ? '...' : 'OK'}
                        </button>
                        <button
                          onClick={() => setEditing(null)}
                          className="px-2 py-1.5 text-gray-500 hover:text-gray-600 text-xs"
                        >
                          Abbrechen
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(match)}
                        className="text-xs px-3 py-1.5 border border-gray-300 rounded-lg text-gray-600 hover:border-wm-green hover:text-wm-green transition-colors"
                      >
                        {match.status === 'finished' ? 'Korrigieren' : 'Ergebnis eingeben'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
