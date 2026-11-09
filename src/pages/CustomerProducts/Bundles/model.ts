import { listBundles } from '@/services/yiyancha/catalog';
import { useCallback, useRef, useState } from 'react';

// 管理组合产品的状态筛选、范围总数及列表请求。
export default function useBundlesModel() {
  const [status, setStatus] = useState('');
  const [scopeTotal, setScopeTotal] = useState<number>();
  const [error, setError] = useState('');
  const currentRequest = useRef<AbortController>();

  const requestBundles = useCallback(
    async (query: YiyanchaAPI.listBundlesParams) => {
      // 新查询取消上一请求，避免旧筛选结果覆盖新结果。
      currentRequest.current?.abort();
      const controller = new AbortController();
      currentRequest.current = controller;
      setError('');
      try {
        const response = await listBundles(query, {
          signal: controller.signal,
          skipErrorHandler: true,
        });
        if (controller.signal.aborted || currentRequest.current !== controller)
          return { data: [], total: 0, success: false };
        if (!response.success || !response.data) {
          setScopeTotal(undefined);
          setError(response.message || '获取组合产品列表失败');
          return { data: [], total: 0, success: false };
        }
        const { items, total, scopeTotal: count } = response.data;
        if (
          !Array.isArray(items) ||
          typeof total !== 'number' ||
          !Number.isInteger(total) ||
          total < 0 ||
          items.some((item) => !item.id)
        ) {
          setScopeTotal(undefined);
          setError('组合产品列表数据格式异常，请稍后重试');
          return { data: [], total: 0, success: false };
        }
        setScopeTotal(count);
        return { data: items, total, success: true };
      } catch {
        if (
          !controller.signal.aborted &&
          currentRequest.current === controller
        ) {
          setScopeTotal(undefined);
          setError('获取组合产品列表失败，请检查网络或访问权限');
        }
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
    setStatus('');
    setScopeTotal(undefined);
    setError('');
  }, []);
  return { status, setStatus, scopeTotal, error, requestBundles, reset };
}
