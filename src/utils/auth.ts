const SESSION_KEY = 'loginSession';
const LEGACY_TOKEN_KEY = 'accessToken';

export function getLoginSession(): YiyanchaAPI.LoginResult | null {
  const value = sessionStorage.getItem(SESSION_KEY);
  if (!value) return null;
  try {
    const data: unknown = JSON.parse(value);
    if (!data || typeof data !== 'object' || Array.isArray(data)) return null;
    return data as YiyanchaAPI.LoginResult;
  } catch {
    return null;
  }
}

export function getAccessToken(): string | null {
  const token = getLoginSession()?.accessToken;
  return typeof token === 'string' && token
    ? token
    : sessionStorage.getItem(LEGACY_TOKEN_KEY);
}

export function clearLoginSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(LEGACY_TOKEN_KEY);
}

export function setLoginSession(session: YiyanchaAPI.LoginResult): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  sessionStorage.removeItem(LEGACY_TOKEN_KEY);
}
