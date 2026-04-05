interface PointsBadgeProps {
  points: number | null;
}

export function PointsBadge({ points }: PointsBadgeProps) {
  if (points === null) return null;

  const styles: Record<number, string> = {
    3: 'bg-green-100 text-green-800 border-green-300',
    1: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    0: 'bg-gray-100 text-gray-500 border-gray-300',
  };

  const labels: Record<number, string> = {
    3: '3 Punkte',
    1: '1 Punkt',
    0: '0 Punkte',
  };

  const cls = styles[points] ?? 'bg-gray-100 text-gray-500 border-gray-300';
  const label = labels[points] ?? `${points} Punkte`;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>
      {label}
    </span>
  );
}
