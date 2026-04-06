const BG_COLORS = 'b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf,f4b8e4,a6d189';

interface AvatarProps {
  username: string;
  avatarUrl: string | null;
  size?: number;
  className?: string;
}

export function Avatar({ username, avatarUrl, size = 40, className = '' }: AvatarProps) {
  const src = avatarUrl?.startsWith('/uploads')
    ? `${import.meta.env.VITE_API_URL?.replace('/api', '') ?? ''}${avatarUrl}`
    : avatarUrl ??
      `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(username)}&backgroundColor=${BG_COLORS}`;

  return (
    <img
      src={src}
      alt={username}
      width={size}
      height={size}
      className={`rounded-full object-cover ${className}`}
      style={{ width: size, height: size }}
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src =
          `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(username)}&backgroundColor=${BG_COLORS}`;
      }}
    />
  );
}
