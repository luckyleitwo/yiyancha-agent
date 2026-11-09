import { useCallback, useRef, useState } from 'react';
import { listAgentRecharges } from './service';
import type { RechargeQuery } from './types';

// 管理查询生命周期，列表数据由 ProTable 持有。
export default function useRechargesModel() {
  const [error, setError] = useState('');
  const currentRequest = useRef<AbortController>();

  const requestRecharges = useCallback(async (query: RechargeQuery) => {
    // 取消旧请求，避免快速切换筛选条件后旧结果覆盖当前列表。
    currentRequest.current?.abort();
    const controller = new AbortController();
    currentRequest.current = controller;
    setError('');
    try {
      const response = await listAgentRecharges(query, {
        signal: controller.signal,
        skipErrorHandler: true,
      });
      if (controller.signal.aborted || currentRequest.current !== controller)
        return { data: [], total: 0, success: false };
      if (!response.success || !response.data) {
        setError(response.message || '获取客户充值记录失败');
        return { data: [], total: 0, success: false };
      }
      const { items, total } = response.data;
      if (
        !Array.isArray(items) ||
        typeof total !== 'number' ||
        !Number.isInteger(total) ||
        total < 0 ||
        items.some((item) => !item.id)
      ) {
        setError('客户充值记录数据格式异常，请稍后重试');
        return { data: [], total: 0, success: false };
      }
      return { data: items, total, success: true };
    } catch {
      if (!controller.signal.aborted && currentRequest.current === controller) {
        setError('获取客户充值记录失败，请检查网络或访问权限');
      }
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
  return { error, requestRecharges, reset };
}
