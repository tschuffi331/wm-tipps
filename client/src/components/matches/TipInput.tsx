import { useState } from 'react';

interface TipInputProps {
  initialHome?: number;
  initialAway?: number;
  onSave: (home: number, away: number) => Promise<void>;
  disabled?: boolean;
}

export function TipInput({ initialHome, initialAway, onSave, disabled = false }: TipInputProps) {
  const [home, setHome] = useState(initialHome ?? '');
  const [away, setAway] = useState(initialAway ?? '');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    const h = Number(home);
    const a = Number(away);
    if (!Number.isInteger(h) || h < 0 || !Number.isInteger(a) || a < 0) return;
    setSaving(true);
    try {
      await onSave(h, a);
    } finally {
      setSaving(false);
    }
  }

  const isValid = home !== '' && away !== '' && Number(home) >= 0 && Number(away) >= 0;
  const isDirty = Number(home) !== initialHome || Number(away) !== initialAway;

  return (
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
          disabled={!isValid || !isDirty || saving}
          className="ml-1 px-3 py-1.5 bg-wm-green text-white text-xs font-semibold rounded-lg
                     hover:bg-green-800 disabled:opacity-40 disabled:cursor-not-allowed
                     focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-wm-green
                     transition-colors"
        >
          {saving ? '...' : 'Speichern'}
        </button>
      )}
    </div>
  );
}
