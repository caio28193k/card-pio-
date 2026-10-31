import type { OpeningHours } from "./types";

const DAY_NAMES = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
/** Posição do dia numa semana que começa na segunda. */
const weekPos = (day: number) => (day + 6) % 7;

const toMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + (m || 0);
};

/** "18:00" → "18h", "23:30" → "23h30" */
export const formatTime = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return m ? `${h}h${String(m).padStart(2, "0")}` : `${h}h`;
};

export function isOpenAt(hours: OpeningHours[], date: Date): boolean {
  const day = date.getDay();
  const minutes = date.getHours() * 60 + date.getMinutes();
  const yesterday = (day + 6) % 7;
  return hours.some(({ days, open, close }) => {
    const o = toMinutes(open);
    const c = toMinutes(close);
    if (c > o) return days.includes(day) && minutes >= o && minutes < c;
    // Fecha depois da meia-noite
    return (days.includes(day) && minutes >= o) || (days.includes(yesterday) && minutes < c);
  });
}

function daysLabel(days: number[]): string {
  const sorted = [...days].sort((a, b) => weekPos(a) - weekPos(b));
  if (sorted.length === 7) return "Todos os dias";
  const consecutive = sorted.every((day, i) => i === 0 || weekPos(day) === weekPos(sorted[i - 1]) + 1);
  if (consecutive && sorted.length >= 3) return `${DAY_NAMES[sorted[0]]} a ${DAY_NAMES[sorted[sorted.length - 1]]}`;
  if (sorted.length === 2) return `${DAY_NAMES[sorted[0]]} e ${DAY_NAMES[sorted[1]]}`;
  return sorted.map((day) => DAY_NAMES[day]).join(", ");
}

export const hoursLines = (hours: OpeningHours[]) =>
  hours.map(({ days, open, close }) => `${daysLabel(days)} · ${formatTime(open)} às ${formatTime(close)}`);

export function todayLabel(hours: OpeningHours[], date: Date): string {
  const today = hours.find(({ days }) => days.includes(date.getDay()));
  return today ? `Hoje, ${formatTime(today.open)} às ${formatTime(today.close)}` : "Hoje não abrimos";
}
