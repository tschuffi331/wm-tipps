const GROUPS = ['ALL', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

interface GroupFilterProps {
  selected: string;
  onChange: (group: string) => void;
}

export function GroupFilter({ selected, onChange }: GroupFilterProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {GROUPS.map((g) => (
        <button
          key={g}
          onClick={() => onChange(g)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            selected === g
              ? 'bg-wm-green text-white shadow'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {g === 'ALL' ? 'Alle' : `Gruppe ${g}`}
        </button>
      ))}
    </div>
  );
}
