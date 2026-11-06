export const paths = {
  grid: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
  building:
    'M4 21V5h11v16 M15 10h5v11 M2 21h20 M8 9h3 M8 13h3 M8 17h3 M17 14h1 M17 18h1',
  layers: 'm12 3 10 5-10 5L2 8z M2 12l10 5 10-5 M2 16l10 5 10-5',
  list: 'M8 5h13 M8 12h13 M8 19h13 M3 5h.01 M3 12h.01 M3 19h.01',
  shield: 'm12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6z m-4 10 3 3 5-6',
  file: 'M14 2H5v20h14V7z M14 2v6h5 M8 12h8 M8 16h8',
  support:
    'M4 15v-4a8 8 0 0 1 16 0v4 M4 12H2v7h4v-7z M20 12h2v7h-4v-7z M18 19c0 3-6 3-6 3',
  box: 'm12 2 10 5v10l-10 5-10-5V7z M2 7l10 5 10-5 M12 12v10 M7 4.5l10 5',
  wallet: 'M3 5h16v4 M3 5v15h19V8H3 M22 12h-6v5h6 M18 14.5h.01',
  coins:
    'M21 6c0 2-4 4-9 4S3 8 3 6s4-4 9-4 9 2 9 4z M3 6v12c0 2 4 4 9 4s9-2 9-4V6 M3 12c0 2 4 4 9 4s9-2 9-4',
  receipt: 'M5 2l3 2 4-2 4 2 3-2v20l-3-2-4 2-4-2-3 2z M8 8h8 M8 12h8 M8 16h5',
  users:
    'M16 21v-2a5 5 0 0 0-5-5H7a5 5 0 0 0-5 5v2 M13 6a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M17 3a4 4 0 0 1 0 8 M22 21v-2a5 5 0 0 0-4-5',
  network:
    'M12 8v5 M5 13h14 M5 13v3 M19 13v3 M9 2h6v6H9z M2 16h6v6H2z M16 16h6v6h-6z',
  key: 'M14 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12 M9 14l-7 7 M3 16l3 3 M5 14l3 3 M16 8h.01',
  tag: 'M3 3h8l10 10-8 8L3 11z M7 7h.01',
  sliders:
    'M5 3v8 M5 15v6 M12 3v3 M12 10v11 M19 3v13 M19 20v1 M2 11h6v4H2z M9 6h6v4H9z M16 16h6v4h-6z',
  database:
    'M20 5c0 2-4 3-8 3S4 7 4 5s4-3 8-3 8 1 8 3z M4 5v14c0 2 4 3 8 3s8-1 8-3V5 M4 12c0 2 4 3 8 3s8-1 8-3',
  plug: 'M8 2v5 M16 2v5 M5 7h14v4a7 7 0 0 1-14 0z M12 18v4',
  activity: 'M2 12h5l3-9 4 18 3-9h5',
  clock: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0 M12 6v6l4 2',
  bell: 'M18 8a6 6 0 0 0-12 0c0 8-3 8-3 10h18c0-2-3-2-3-10 M10 21h4',
  help: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0 M9 8a3 3 0 0 1 6 1c0 2-3 2-3 4 M12 17h.01',
  check: 'm5 12 4 4L19 6',
  search: 'M21 21l-5-5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
  menu: 'M3 6h18 M3 12h18 M3 18h18',
};

export type LayoutIconName = keyof typeof paths;

export function isLayoutIconName(value: unknown): value is LayoutIconName {
  return (
    typeof value === 'string' &&
    Object.prototype.hasOwnProperty.call(paths, value)
  );
}
