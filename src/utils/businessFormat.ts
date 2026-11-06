export const money = (value: number) =>
  `¥${value.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export function dateKey(value: string | number | Date): string {
  return new Date(value).toLocaleDateString('en-CA', {
    timeZone: 'Asia/Shanghai',
  });
}

export function dateTime(value?: string): string {
  if (!value) return '—';
  return new Date(value).toLocaleString('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}
