import { useCallback, useRef, useState } from 'react';
import { listAgentSettlements } from './service';
import type { SettlementQuery } from './types';

// 列表由 ProTable 持有，model 管理请求生命周期和错误。
export default function useSettlementsModel() {
  const [error, setError] = useState('');
  const currentRequest = useRef<AbortController>();
  const requestSettlements = useCallback(async (query: SettlementQuery) => {
    // 筛选变化时取消旧请求，防止旧响应覆盖当前结果。
    currentRequest.current?.abort();
    const controller = new AbortController();
    currentRequest.current = controller;
    setError('');
    try {
      const response = await listAgentSettlements(query, {
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
        setError('结算记录数据格式异常，请稍后重试');
        return { data: [], total: 0, success: false };
      }
      return { data: items, total, success: true };
    } catch {
      if (!controller.signal.aborted && currentRequest.current === controller)
        setError('获取结算记录失败，请检查网络或访问权限');
      return { data: [], total: 0, success: false };
    } finally {
      if (currentRequest.current === controller)
        currentRequest.current = undefined;
    }
  }, []);
  const reset = useCallback(() => {
    currentRequest.current?.abort();
    currentRequest.current = undefined;
    setError('');
  }, []);
  return { error, requestSettlements, reset };
}
