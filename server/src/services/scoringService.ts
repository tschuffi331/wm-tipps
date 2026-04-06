import db from '../db/database';

interface TipInput {
  home_goals_tip: number;
  away_goals_tip: number;
}

interface Result {
  home_goals: number;
  away_goals: number;
}

export function calculatePoints(tip: TipInput, result: Result): number {
  if (tip.home_goals_tip === result.home_goals && tip.away_goals_tip === result.away_goals) {
    return 3;
  }
  const tipOutcome  = Math.sign(tip.home_goals_tip  - tip.away_goals_tip);
  const realOutcome = Math.sign(result.home_goals    - result.away_goals);
  if (tipOutcome === realOutcome) return 1;
  return 0;
}

export function recalculateMatchTips(matchId: number): void {
  const match = db.prepare(
    'SELECT home_goals, away_goals FROM matches WHERE id = ?'
  ).get(matchId) as Result | undefined;

  if (!match || match.home_goals == null || match.away_goals == null) return;

  const tips = db.prepare(
    'SELECT id, home_goals_tip, away_goals_tip FROM tips WHERE match_id = ?'
  ).all(matchId) as Array<{ id: number } & TipInput>;

  const updateTip = db.prepare('UPDATE tips SET points_awarded = ? WHERE id = ?');

  const updateAll = db.transaction(() => {
    for (const tip of tips) {
      const pts = calculatePoints(tip, match);
      updateTip.run(pts, tip.id);
    }
  });

  updateAll();
}
