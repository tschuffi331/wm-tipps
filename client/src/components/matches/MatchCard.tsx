import { useState } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import toast from 'react-hot-toast';
import type { Match, Tip } from '../../types';
import { TipInput } from './TipInput';
import { PointsBadge } from '../common/PointsBadge';
import { CountdownTimer } from '../common/CountdownTimer';
import { submitTip, updateTip } from '../../api/tips';

interface MatchCardProps {
  match: Match;
  tip?: Tip;
  onTipSaved: (tip: Tip) => void;
  isLoggedIn: boolean;
}

export function MatchCard({ match, tip, onTipSaved, isLoggedIn }: MatchCardProps) {
  const kickoff    = new Date(match.kickoff_utc);
  const isPast     = kickoff <= new Date();
  const hasResult  = match.home_goals != null && match.away_goals != null;

  const [currentTip, setCurrentTip] = useState<Tip | undefined>(tip);

  async function handleSave(home: number, away: number) {
    try {
      let saved: Tip;
      if (currentTip) {
        await updateTip(currentTip.id, home, away);
        saved = { ...currentTip, home_goals_tip: home, away_goals_tip: away };
      } else {
        const response = await submitTip(match.id, home, away);
        saved = {
          id:             response.id,
          match_id:       match.id,
          home_goals_tip: home,
          away_goals_tip: away,
          points_awarded: null,
          submitted_at:   new Date().toISOString(),
        };
      }
      setCurrentTip(saved);
      onTipSaved(saved);
      toast.success('Tipp gespeichert!');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Fehler beim Speichern';
      toast.error(msg);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      {/* Header: date + group */}
      <div className="flex justify-between items-center mb-3 text-xs text-gray-500">
        <span>{format(kickoff, 'EEE, dd. MMM · HH:mm', { locale: de })} Uhr</span>
        <span className="bg-wm-dark text-white px-2 py-0.5 rounded-full text-xs font-medium">
          Gruppe {match.group_name} · Spieltag {match.matchday}
        </span>
      </div>

      {/* Teams + score area */}
      <div className="flex items-center justify-between gap-2">
        {/* Home */}
        <div className="flex-1 flex items-center gap-2">
          <span className="text-2xl">{match.home_team.flag_emoji ?? ''}</span>
          <div>
            <div className="font-semibold text-sm text-gray-800 leading-tight">{match.home_team.name}</div>
            <div className="text-xs text-gray-400">{match.home_team.short_name}</div>
          </div>
        </div>

        {/* Middle: result / tip / input */}
        <div className="flex flex-col items-center gap-1.5 min-w-[140px]">
          {hasResult ? (
            <div className="flex items-center gap-2 text-2xl font-bold text-wm-dark">
              <span>{match.home_goals}</span>
              <span className="text-gray-300">:</span>
              <span>{match.away_goals}</span>
            </div>
          ) : isPast ? (
            <div className="text-xs text-gray-400 italic">Ergebnis ausstehend</div>
          ) : null}

          {isPast ? (
            currentTip ? (
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-0.5">Dein Tipp:</div>
                <div className="flex items-center gap-1 justify-center font-semibold text-sm">
                  <span>{currentTip.home_goals_tip}</span>
                  <span className="text-gray-400">:</span>
                  <span>{currentTip.away_goals_tip}</span>
                </div>
                <PointsBadge points={currentTip.points_awarded} />
              </div>
            ) : (
              <div className="text-xs text-gray-400 italic">
                {isLoggedIn ? 'Kein Tipp abgegeben' : ''}
              </div>
            )
          ) : isLoggedIn ? (
            <TipInput
              initialHome={currentTip?.home_goals_tip}
              initialAway={currentTip?.away_goals_tip}
              onSave={handleSave}
            />
          ) : (
            <div className="text-xs text-gray-400">
              <CountdownTimer kickoffUtc={match.kickoff_utc} />
            </div>
          )}

          {!isPast && isLoggedIn && (
            <CountdownTimer kickoffUtc={match.kickoff_utc} />
          )}
        </div>

        {/* Away */}
        <div className="flex-1 flex items-center gap-2 justify-end text-right">
          <div>
            <div className="font-semibold text-sm text-gray-800 leading-tight">{match.away_team.name}</div>
            <div className="text-xs text-gray-400">{match.away_team.short_name}</div>
          </div>
          <span className="text-2xl">{match.away_team.flag_emoji ?? ''}</span>
        </div>
      </div>

      {/* Venue */}
      {match.venue && (
        <div className="mt-2 text-xs text-gray-400 text-center">{match.venue}</div>
      )}
    </div>
  );
}
