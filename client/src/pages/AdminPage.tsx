import { useState, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { fetchAdminMatches, setMatchResult, fetchAdminUsers, renameUser, deleteUser } from '../api/admin';
import type { LiveResult, AdminUser } from '../api/admin';
import { getPasswordRules, updatePasswordRules } from '../api/settings';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import type { Match, PasswordRules, WmPhase } from '../types';
import { WM_PHASES } from '../types';

const TEAM_NAME_MAP: Record<string, string> = {
  'Czech Republic': 'Czechia',
  'United States': 'USA',
  'Democratic Republic of the Congo': 'DR Congo',
};

export function AdminPage() {
  useEffect(() => { document.title = 'Admin — WM Tipps 2026'; }, []);
  const queryClient = useQueryClient();
  const { data: matches, isLoading } = useQuery({
    queryKey: ['adminMatches'],
    queryFn: fetchAdminMatches,
  });

  const [editing, setEditing] = useState<{ matchId: number; home: string; away: string } | null>(null);
  const [saving, setSaving] = useState(false);

  // User management state
  const { data: adminUsers, isLoading: usersLoading, refetch: refetchUsers } = useQuery<AdminUser[]>({
    queryKey: ['adminUsers'],
    queryFn: fetchAdminUsers,
  });
  const [renamingUser, setRenamingUser] = useState<{ username: string; draft: string } | null>(null);
  const [renameSaving, setRenameSaving] = useState(false);
  const [deletingUser, setDeletingUser] = useState<string | null>(null);
  const [deleteInProgress, setDeleteInProgress] = useState(false);

  async function handleRenameUser() {
    if (!renamingUser) return;
    const trimmed = renamingUser.draft.trim();
    if (!trimmed || trimmed === renamingUser.username) { setRenamingUser(null); return; }
    setRenameSaving(true);
    try {
      await renameUser(renamingUser.username, trimmed);
      toast.success(`Benutzer umbenannt zu „${trimmed}"`);
      setRenamingUser(null);
      refetchUsers();
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ?? 'Umbenennung fehlgeschlagen');
    } finally {
      setRenameSaving(false);
    }
  }

  async function handleDeleteUser(username: string) {
    setDeleteInProgress(true);
    try {
      await deleteUser(username);
      toast.success(`Benutzer „${username}" gelöscht`);
      setDeletingUser(null);
      refetchUsers();
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ?? 'Löschen fehlgeschlagen');
    } finally {
      setDeleteInProgress(false);
    }
  }

  // Live result sync state
  const [liveResults, setLiveResults] = useState<LiveResult[] | null>(null);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);

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

  async function handleFetchLiveResults() {
    if (!matches) return;
    setFetchLoading(true);
    try {
      const resp = await fetch('https://worldcup26.ir/get/games');
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      const games: Array<Record<string, string>> = Array.isArray(data) ? data : (data.games ?? []);

      const matchLookup = new Map<string, Match>();
      for (const m of matches) {
        if (m.home_team.name && m.away_team.name) {
          matchLookup.set(`${m.home_team.name}|${m.away_team.name}`, m);
        }
      }

      const results: LiveResult[] = [];
      for (const g of games) {
        if (g.finished !== 'TRUE') continue;
        const home = TEAM_NAME_MAP[g.home_team_name_en] ?? g.home_team_name_en;
        const away = TEAM_NAME_MAP[g.away_team_name_en] ?? g.away_team_name_en;
        const homeGoals = parseInt(g.home_score, 10);
        const awayGoals = parseInt(g.away_score, 10);
        if (isNaN(homeGoals) || isNaN(awayGoals)) continue;

        const match = matchLookup.get(`${home}|${away}`);
        if (!match) continue;

        results.push({
          match_id: match.id,
          match_number: match.match_number,
          home_team: home,
          away_team: away,
          home_goals: homeGoals,
          away_goals: awayGoals,
          already_saved:
            match.status === 'finished' &&
            match.home_goals === homeGoals &&
            match.away_goals === awayGoals,
        });
      }

      setLiveResults(results);
      const newCount = results.filter(r => !r.already_saved).length;
      if (newCount === 0) {
        toast.success('Alle bekannten Ergebnisse sind bereits eingetragen.');
      } else {
        toast.success(`${newCount} neue${newCount === 1 ? 's' : ''} Ergebnis${newCount === 1 ? '' : 'se'} gefunden.`);
      }
    } catch (err: unknown) {
      toast.error('Abruf fehlgeschlagen: ' + (err instanceof Error ? err.message : 'Unbekannter Fehler'));
    } finally {
      setFetchLoading(false);
    }
  }

  async function handleApplyAll() {
    if (!liveResults) return;
    const pending = liveResults.filter(r => !r.already_saved);
    if (pending.length === 0) return;
    setApplyLoading(true);
    let success = 0;
    let failed = 0;
    for (const r of pending) {
      try {
        await setMatchResult(r.match_id, r.home_goals, r.away_goals);
        success++;
        // Mark as saved in local state
        setLiveResults(prev =>
          prev?.map(lr => lr.match_id === r.match_id ? { ...lr, already_saved: true } : lr) ?? null
        );
      } catch {
        failed++;
      }
    }
    setApplyLoading(false);
    if (failed === 0) {
      toast.success(`${success} Ergebnis${success === 1 ? '' : 'se'} erfolgreich übernommen!`);
    } else {
      toast.error(`${success} übernommen, ${failed} fehlgeschlagen.`);
    }
    await queryClient.invalidateQueries({ queryKey: ['adminMatches'] });
    await queryClient.invalidateQueries({ queryKey: ['matches'] });
  }

  if (isLoading) return <LoadingSpinner message="Spiele werden geladen..." />;

  const GROUP_STAGE = ['A','B','C','D','E','F','G','H','I','J','K','L'];
  const KO_PHASES   = ['Sechzehntelfinale','Achtelfinale','Viertelfinale','Halbfinale','Finale'];

  const grouped: Record<string, Match[]> = {};
  for (const m of matches ?? []) {
    if (!grouped[m.group_name]) grouped[m.group_name] = [];
    grouped[m.group_name].push(m);
  }

  function sectionSortKey(key: string): string {
    const gi = GROUP_STAGE.indexOf(key);
    if (gi >= 0) return `0_${gi.toString().padStart(2, '0')}`;
    const ki = KO_PHASES.indexOf(key);
    return ki >= 0 ? `1_${ki}` : `2_${key}`;
  }

  const newResults = liveResults?.filter(r => !r.already_saved) ?? [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-wm-dark mb-2">Admin — Ergebnisse eintragen</h1>
      <p className="text-sm text-gray-500 mb-6">
        Klicke auf ein Spiel, um das Ergebnis einzutragen. Punkte werden sofort neu berechnet.
      </p>

      {/* WM-Phase */}
      {rules && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
          <h2 className="text-base font-bold text-wm-dark mb-4">WM-Phase</h2>
          <div className="flex items-center gap-4">
            <label htmlFor="wm-phase" className="text-sm text-gray-700 w-44 shrink-0">Aktuelle Phase</label>
            <select
              id="wm-phase"
              value={pwDraft?.wmPhase ?? rules.wmPhase}
              onChange={e => setPwDraft({ ...(pwDraft ?? rules), wmPhase: e.target.value as WmPhase })}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-wm-green bg-white"
            >
              {WM_PHASES.map(phase => (
                <option key={phase} value={phase}>{phase}</option>
              ))}
            </select>
          </div>
          {pwDraft?.wmPhase !== undefined && pwDraft.wmPhase !== rules.wmPhase && (
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => savePwRules.mutate(pwDraft!)}
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

      {/* Passwortregeln */}
      {rules && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
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

      {/* ── Benutzer ändern ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
        <h2 className="text-base font-bold text-wm-dark mb-4">Benutzer ändern</h2>
        {usersLoading ? (
          <p className="text-sm text-gray-500">Laden…</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {adminUsers?.map(user => (
              <div key={user.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                {renamingUser?.username === user.username ? (
                  <>
                    <input
                      type="text"
                      value={renamingUser.draft}
                      onChange={e => setRenamingUser({ ...renamingUser, draft: e.target.value })}
                      onKeyDown={e => { if (e.key === 'Enter') handleRenameUser(); if (e.key === 'Escape') setRenamingUser(null); }}
                      autoFocus
                      className="flex-1 border-2 border-wm-green rounded-lg px-3 py-1 text-sm focus:outline-none"
                    />
                    <button
                      onClick={handleRenameUser}
                      disabled={renameSaving}
                      className="px-3 py-1.5 bg-wm-green text-white text-xs font-semibold rounded-lg hover:bg-green-800 disabled:opacity-50 transition-colors"
                    >
                      {renameSaving ? '…' : 'OK'}
                    </button>
                    <button
                      onClick={() => setRenamingUser(null)}
                      className="px-2 py-1.5 text-gray-500 hover:text-gray-700 text-xs"
                    >
                      Abbrechen
                    </button>
                  </>
                ) : deletingUser === user.username ? (
                  <>
                    <span className="flex-1 text-sm text-red-700 font-medium">
                      „{user.username}" wirklich löschen? Alle Tipps werden entfernt.
                    </span>
                    <button
                      onClick={() => handleDeleteUser(user.username)}
                      disabled={deleteInProgress}
                      className="px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                    >
                      {deleteInProgress ? '…' : 'Ja, löschen'}
                    </button>
                    <button
                      onClick={() => setDeletingUser(null)}
                      className="px-2 py-1.5 text-gray-500 hover:text-gray-700 text-xs"
                    >
                      Abbrechen
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-sm text-gray-800">
                      {user.username}
                      {user.is_admin && (
                        <span className="ml-2 text-xs font-medium text-wm-green">Admin</span>
                      )}
                    </span>
                    <button
                      onClick={() => { setDeletingUser(null); setRenamingUser({ username: user.username, draft: user.username }); }}
                      className="text-xs px-3 py-1.5 border border-gray-300 rounded-lg text-gray-600 hover:border-wm-green hover:text-wm-green transition-colors"
                    >
                      Umbenennen
                    </button>
                    <button
                      onClick={() => { setRenamingUser(null); setDeletingUser(user.username); }}
                      disabled={user.is_admin}
                      title={user.is_admin ? 'Admin-Benutzer können nicht gelöscht werden' : undefined}
                      className="text-xs px-3 py-1.5 border border-red-200 rounded-lg text-red-500 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      Löschen
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Aktuelle Ergebnisse abrufen ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-wm-dark">Aktuelle Ergebnisse abrufen</h2>
            {liveResults && (
              <p className="text-xs text-gray-500 mt-0.5">
                {liveResults.length} Spiel{liveResults.length !== 1 ? 'e' : ''} gefunden
                {newResults.length > 0
                  ? ` · ${newResults.length} neu`
                  : ' · alle bereits eingetragen'}
              </p>
            )}
          </div>
          <button
            onClick={handleFetchLiveResults}
            disabled={fetchLoading || applyLoading}
            className="shrink-0 flex items-center gap-2 px-4 py-2 bg-wm-green text-white text-sm font-semibold rounded-lg
                       hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {fetchLoading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
                </svg>
                Abrufen…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m0 0A8 8 0 0112 4a8 8 0 018 8H4m.582-3H20v5m0 0a8 8 0 01-8 8 8 8 0 01-8-8h4" />
                </svg>
                Abrufen
              </>
            )}
          </button>
        </div>

        {liveResults && liveResults.length > 0 && (
          <div className="mt-4 space-y-1.5">
            {liveResults.map(r => (
              <div
                key={r.match_id}
                className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm
                  ${r.already_saved ? 'bg-gray-50 text-gray-400' : 'bg-green-50 border border-green-200 text-gray-800'}`}
              >
                <span className={r.already_saved ? '' : 'font-medium'}>
                  {r.home_team}
                  <span className="mx-2 font-bold tabular-nums">{r.home_goals}:{r.away_goals}</span>
                  {r.away_team}
                </span>
                {r.already_saved ? (
                  <span className="text-xs text-gray-400 shrink-0">✓ eingetragen</span>
                ) : (
                  <span className="text-xs font-semibold text-green-700 bg-green-100 px-1.5 py-0.5 rounded shrink-0">NEU</span>
                )}
              </div>
            ))}

            {newResults.length > 0 && (
              <div className="pt-3">
                <button
                  onClick={handleApplyAll}
                  disabled={applyLoading}
                  className="w-full py-2 bg-wm-green text-white text-sm font-semibold rounded-lg
                             hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {applyLoading
                    ? 'Wird übernommen…'
                    : `${newResults.length} neue${newResults.length === 1 ? 's' : ''} Ergebnis${newResults.length === 1 ? '' : 'se'} übernehmen`}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Spielergebnisse */}
      {Object.entries(grouped).sort(([a], [b]) => sectionSortKey(a).localeCompare(sectionSortKey(b))).map(([group, groupMatches]) => (
        <div key={group} className="mb-8">
          <h2 className="text-lg font-bold text-wm-dark mb-3 flex items-center gap-2">
            <span className="bg-wm-dark text-wm-gold px-2.5 py-0.5 rounded-md text-sm">
              {GROUP_STAGE.includes(group) ? `Gruppe ${group}` : group}
            </span>
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
