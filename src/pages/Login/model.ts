import { login } from '@/services/yiyancha/auth';
import { setLoginSession } from '@/utils/auth';
import { useRef, useState } from 'react';

export type LoginValues = Pick<
  YiyanchaAPI.LoginRequest,
  'loginName' | 'password'
>;

// 登录固定使用代理端门户，并缓存服务端返回的会话信息。
export default function useLoginModel() {
  const [loading, setLoading] = useState(false);
  const submitting = useRef(false);

  const submitLogin = async (
    values: LoginValues,
  ): Promise<string | undefined> => {
    if (submitting.current) return '正在登录，请稍候';
    submitting.current = true;
    setLoading(true);
    try {
      const response = await login(
        { ...values, portal: 'AGENT' },
        { skipErrorHandler: true },
      );
      if (!response.success || !response.data?.accessToken) {
        return response.message || '登录失败，请检查账号和密码';
      }
      setLoginSession(response.data);
      return undefined;
    } catch {
      return '登录请求失败，请检查网络或账号密码';
    } finally {
      submitting.current = false;
      setLoading(false);
    }
  };

  return { loading, submitLogin };
}
