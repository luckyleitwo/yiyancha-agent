import { me } from '@/services/yiyancha/auth';
import { clearLoginSession, getAccessToken } from '@/utils/auth';

export type InitialState = {
  currentUser?: YiyanchaAPI.CurrentUserResult;
  authStatus: 'authenticated' | 'anonymous';
};

export async function loadCurrentSession(): Promise<InitialState> {
  const token = getAccessToken();
  if (!token) return { authStatus: 'anonymous' };

  try {
    const response = await me({
      headers: { Authorization: `Bearer ${token}` },
      skipErrorHandler: true,
      timeout: 10000,
    });
    if (response.success && response.data?.userId) {
      return { authStatus: 'authenticated', currentUser: response.data };
    }
  } catch {
    // 验证失败时统一回到登录页。
  }
  clearLoginSession();
  return { authStatus: 'anonymous' };
}
