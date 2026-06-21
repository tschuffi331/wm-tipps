import { useState } from 'react';
import toast from 'react-hot-toast';
import { fetchAiTip } from '../../api/ai';
import type { AiTip } from '../../api/ai';

interface TipInputProps {
  matchId: number;
  initialHome?: number;
  initialAway?: number;
  onSave: (home: number, away: number) => Promise<void>;
  disabled?: boolean;
}

export function TipInput({ matchId, initialHome, initialAway, onSave, disabled = false }: TipInputProps) {
  const [home, setHome] = useState<number | ''>(initialHome !== undefined ? initialHome : '');
  const [away, setAway] = useState<number | ''>(initialAway !== undefined ? initialAway : '');
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiTip, setAiTip] = useState<AiTip | null>(null);

  async function handleSave() {
    if (home === '' || away === '' || home < 0 || away < 0) return;
    setSaving(true);
    try {
      await onSave(home, away);
    } finally {
      setSaving(false);
    }
  }

  async function handleAiTip() {
    setAiLoading(true);
    setAiTip(null);
    try {
      const tip = await fetchAiTip(matchId);
      setAiTip(tip);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
        ?? 'KI-Tipp konnte nicht geladen werden';
      toast.error(msg);
    } finally {
      setAiLoading(false);
    }
  }

  function adoptAiTip() {
    if (!aiTip) return;
    setHome(aiTip.home_goals);
    setAway(aiTip.away_goals);
  }

  return (
    <div className="flex flex-col items-center gap-1.5">
      {/* Score inputs + save button */}
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={0}
          max={99}
          value={home}
          aria-label="Heimtore"
          onChange={(e) => setHome(e.target.value === '' ? '' : Number(e.target.value))}
          disabled={disabled || saving}
          className="w-12 text-center border-2 border-gray-300 rounded-lg py-1 text-lg font-bold
                     focus:border-wm-green focus:outline-none focus-visible:ring-2 focus-visible:ring-wm-green
                     disabled:bg-gray-100 disabled:text-gray-400"
        />
        <span className="text-gray-400 font-bold" aria-hidden="true">:</span>
        <input
          type="number"
          min={0}
          max={99}
          value={away}
          aria-label="Auswärtstore"
          onChange={(e) => setAway(e.target.value === '' ? '' : Number(e.target.value))}
          disabled={disabled || saving}
          className="w-12 text-center border-2 border-gray-300 rounded-lg py-1 text-lg font-bold
                     focus:border-wm-green focus:outline-none focus-visible:ring-2 focus-visible:ring-wm-green
                     disabled:bg-gray-100 disabled:text-gray-400"
        />
        {!disabled && (
          <button
            onClick={handleSave}
            disabled={home === '' || away === '' || saving}
            className="ml-1 px-3 py-1.5 bg-wm-green text-white text-xs font-semibold rounded-lg
                       hover:bg-green-800 disabled:opacity-40 disabled:cursor-not-allowed
                       focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-wm-green
                       transition-colors"
          >
            {saving ? '...' : 'Speichern'}
          </button>
        )}
      </div>

      {/* AI tip button + result */}
      {!disabled && (
        <div className="flex flex-col items-center gap-1 w-full">
          {!aiTip && (
            <button
              onClick={handleAiTip}
              disabled={aiLoading}
              className="text-xs text-gray-400 hover:text-wm-green disabled:opacity-50
                         flex items-center gap-1 transition-colors"
            >
              {aiLoading ? (
                <span className="animate-pulse">KI Tipp wird geladen…</span>
              ) : (
                <>✨ KI Tipp anzeigen</>
              )}
            </button>
          )}

          {aiTip && (
            <div className="mt-0.5 bg-purple-50 border border-purple-200 rounded-lg px-3 py-2 text-center w-full max-w-xs">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-xs font-medium text-purple-700">
                  ✨ KI Tipp: {aiTip.home_goals} : {aiTip.away_goals}
                </span>
                <button
                  onClick={adoptAiTip}
                  className="text-xs text-purple-600 underline hover:text-purple-800 shrink-0"
                >
                  Übernehmen
                </button>
              </div>
              <p className="text-xs text-purple-600 leading-snug">{aiTip.reasoning}</p>
              <button
                onClick={() => setAiTip(null)}
                className="mt-1 text-xs text-purple-400 hover:text-purple-600"
              >
                schließen
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
