export const PHOTOGRAPHER_COLORS = [
  'bg-sky-600 text-white',
  'bg-indigo-600 text-white',
  'bg-violet-600 text-white',
  'bg-teal-600 text-white',
  'bg-rose-600 text-white',
  'bg-amber-700 text-white',
  'bg-emerald-700 text-white',
  'bg-cyan-700 text-white',
];

export function dutyDateLabel(value) {
  if (!value) return '';
  const s = String(value).slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  } catch {
    return '';
  }
}

export function colorForPhotographer(name) {
  const key = String(name || '');
  let h = 0;
  for (let i = 0; i < key.length; i += 1) {
    h = (h + key.charCodeAt(i) * (i + 3)) % 100000;
  }
  return PHOTOGRAPHER_COLORS[h % PHOTOGRAPHER_COLORS.length];
}

export function getCalendarDays(calendarMonth) {
  const y = calendarMonth.getFullYear();
  const m = calendarMonth.getMonth();
  const firstDay = new Date(y, m, 1);
  const lastDay = new Date(y, m + 1, 0);
  const startWeekday = firstDay.getDay();
  const offset = startWeekday === 0 ? 6 : startWeekday - 1;
  const days = [];
  for (let i = 0; i < offset; i += 1) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d += 1) {
    days.push(new Date(y, m, d));
  }
  return days;
}
