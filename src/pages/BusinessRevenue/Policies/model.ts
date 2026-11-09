import { listAgentPolicies } from '@/services/yiyancha/catalog';
import { useCallback, useRef, useState } from 'react';

// 列表数据交给 ProTable；model 管理请求竞态及异常。
export default function usePoliciesModel() {
  const [error, setError] = useState('');
  const currentRequest = useRef<AbortController>();
  const requestPolicies = useCallback(
    async (query: YiyanchaAPI.listAgentPoliciesParams) => {
      // 取消上一请求，避免筛选或离页后旧结果覆盖新数据。
      currentRequest.current?.abort();
      const controller = new AbortController();
      currentRequest.current = controller;
      setError('');
      try {
        const response = await listAgentPolicies(query, {
          signal: controller.signal,
          skipErrorHandler: true,
        });
        if (controller.signal.aborted || currentRequest.current !== controller)
          return { data: [], total: 0, success: false };
        // 明确的业务失败由全局响应拦截器提示。
        if (!response.success) return { data: [], total: 0, success: false };
        const { items, total } = response.data ?? {};
        if (
          !Array.isArray(items) ||
          typeof total !== 'number' ||
          !Number.isInteger(total) ||
          total < 0 ||
          items.some((item) => !item.id)
        ) {
          setError('分佣配置列表数据格式异常，请稍后重试');
          return { data: [], total: 0, success: false };
        }
        return { data: items, total, success: true };
      } catch {
        if (!controller.signal.aborted && currentRequest.current === controller)
          setError('获取分佣配置失败，请检查网络或访问权限');
        return { data: [], total: 0, success: false };
      } finally {
        if (currentRequest.current === controller)
          currentRequest.current = undefined;
      }
    },
    [],
  );
  const reset = useCallback(() => {
    currentRequest.current?.abort();
    currentRequest.current = undefined;
    setError('');
  }, []);
  return { error, requestPolicies, reset };
}
