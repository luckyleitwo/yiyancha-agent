import { listPrices } from '@/services/yiyancha/catalog';
import { useCallback, useRef, useState } from 'react';

// 当前有效价格由服务端筛选与分页，model 管理请求状态及范围总数。
export default function usePricesModel() {
  const [scopeTotal, setScopeTotal] = useState<number>();
  const [error, setError] = useState('');
  const currentRequest = useRef<AbortController>();

  const requestPrices = useCallback(
    async (query: YiyanchaAPI.listPricesParams) => {
      // 取消过期查询，防止旧结果覆盖新的筛选条件。
      currentRequest.current?.abort();
      const controller = new AbortController();
      currentRequest.current = controller;
      setError('');
      try {
        const response = await listPrices(query, {
          signal: controller.signal,
          skipErrorHandler: true,
        });
        if (controller.signal.aborted || currentRequest.current !== controller)
          return { data: [], total: 0, success: false };
        if (!response.success || !response.data) {
          setScopeTotal(undefined);
          setError(response.message || '获取销售定价列表失败');
          return { data: [], total: 0, success: false };
        }
        const { items, total, scopeTotal: count } = response.data;
        if (
          !Array.isArray(items) ||
          typeof total !== 'number' ||
          !Number.isInteger(total) ||
          total < 0 ||
          items.some((item) => !item.agentId || !item.productId)
        ) {
          setScopeTotal(undefined);
          setError('销售定价列表数据格式异常，请稍后重试');
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
          setError('获取销售定价列表失败，请检查网络或访问权限');
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
    setScopeTotal(undefined);
    setError('');
  }, []);
  return { scopeTotal, error, requestPrices, reset };
}
