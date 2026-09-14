const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

export function formatDateTime(date: Date): string {
  const d = new Date(date);
  const day = d.getDate();
  const month = MONTHS[d.getMonth()];
  const year = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${day} ${month} ${year}, ${hh}.${mm}`;
}

export function formatRelative(date: Date): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");

  if (diffMin < 1) return "Baru saja";
  if (diffMin < 60) return `${diffMin} mnt lalu`;

  const isToday = d.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = d.toDateString() === yesterday.toDateString();

  if (isToday) return `Hari ini • ${hh}.${mm}`;
  if (isYesterday) return `Kemarin • ${hh}.${mm}`;
  return `${d.getDate()} ${MONTHS[d.getMonth()]} • ${hh}.${mm}`;
}

const AVATAR_COLORS = [
  "bg-rose-500",
  "bg-sky-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-amber-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-orange-500",
];

export function avatarColorForId(id: number): string {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}
