import { useQuery } from '@tanstack/react-query';
import { fetchLeaderboard } from '../api/leaderboard';
import { Avatar } from '../components/common/Avatar';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

export function LeaderboardPage() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: fetchLeaderboard,
    refetchInterval: 60_000,
  });

  if (isLoading) return <LoadingSpinner message="Rangliste wird geladen..." />;

  const rankColors: Record<number, string> = {
    1: 'text-yellow-500',
    2: 'text-gray-400',
    3: 'text-amber-600',
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-wm-dark mb-6">Rangliste</h1>

      {!data?.length ? (
        <p className="text-center text-gray-400 py-12">Noch keine Einträge.</p>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-wm-dark text-white text-sm">
              <tr>
                <th className="px-4 py-3 text-left w-10">#</th>
                <th className="px-4 py-3 text-left">Spieler</th>
                <th className="px-4 py-3 text-center">Punkte</th>
                <th className="px-4 py-3 text-center hidden sm:table-cell">Exakt</th>
                <th className="px-4 py-3 text-center hidden sm:table-cell">Tendenz</th>
                <th className="px-4 py-3 text-center hidden md:table-cell">Tipps</th>
              </tr>
            </thead>
            <tbody>
              {data.map((entry, i) => {
                const isMe = user?.id === entry.id;
                return (
                  <tr
                    key={entry.id}
                    className={`border-t border-gray-100 hover:bg-gray-50 transition-colors ${
                      isMe ? 'bg-green-50' : i % 2 === 0 ? '' : 'bg-gray-50/30'
                    }`}
                  >
                    <td className={`px-4 py-3 font-bold text-lg ${rankColors[entry.rank] ?? 'text-gray-400'}`}>
                      {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : entry.rank}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar username={entry.username} avatarUrl={entry.avatar_url} size={36} />
                        <span className={`font-medium ${isMe ? 'text-wm-green' : 'text-gray-800'}`}>
                          {entry.username}
                          {isMe && <span className="ml-1 text-xs text-wm-green">(Du)</span>}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-lg text-wm-dark">
                      {entry.total_points}
                    </td>
                    <td className="px-4 py-3 text-center hidden sm:table-cell text-green-700 font-semibold">
                      {entry.exact_scores}
                    </td>
                    <td className="px-4 py-3 text-center hidden sm:table-cell text-yellow-600 font-semibold">
                      {entry.correct_outcomes}
                    </td>
                    <td className="px-4 py-3 text-center hidden md:table-cell text-gray-500 text-sm">
                      {entry.tips_evaluated}/{entry.tips_total}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
