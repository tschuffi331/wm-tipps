const BG_COLORS = 'b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf,f4b8e4,a6d189';

export function getDiceBearUrl(username: string): string {
  return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(username)}&backgroundColor=${BG_COLORS}`;
}
