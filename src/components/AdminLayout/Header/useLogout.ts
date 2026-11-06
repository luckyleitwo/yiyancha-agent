import { logout } from '@/services/yiyancha/auth';
import { clearLoginSession, getAccessToken } from '@/utils/auth';
import { useRef, useState } from 'react';

export function useLogout() {
  const [loading, setLoading] = useState(false);
  const submitting = useRef(false);

  const submitLogout = async (): Promise<boolean | undefined> => {
    if (submitting.current) return undefined;
    submitting.current = true;
    setLoading(true);
    let revoked = false;
    try {
      const token = getAccessToken();
      if (token) {
        const response = await logout({
          headers: { Authorization: `Bearer ${token}` },
          skipErrorHandler: true,
          timeout: 10000,
        });
        revoked = response.success === true;
      }
    } catch {
      revoked = false;
    } finally {
      clearLoginSession();
      submitting.current = false;
      setLoading(false);
    }
    return revoked;
  };

  return { loading, submitLogout };
}
