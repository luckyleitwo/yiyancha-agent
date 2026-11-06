import '@umijs/max/typings';

declare global {
  const __API_BASE_URLS__: Readonly<Record<string, string>>;
}
