import { useCallback, useRef, useState } from 'react';
import { listAgentOrders } from './service';
import type { OrderQuery } from './types';

// 管理客户查询记录的列表请求。
export default function useOrdersModel() {
  const [error, setError] = useState('');
  const currentRequest = useRef<AbortController>();
  const exportRequest = useRef<AbortController>();
  const lastQuery = useRef<OrderQuery>();

  const requestOrders = useCallback(async (query: OrderQuery) => {
    // 新查询取消上一请求，避免旧筛选结果覆盖新结果。
    currentRequest.current?.abort();
    const controller = new AbortController();
    currentRequest.current = controller;
    // 导出使用最后一次提交的完整筛选条件，不读取表单中未提交的草稿。
    lastQuery.current = { ...query };
    setError('');
    try {
      const response = await listAgentOrders(query, {
        signal: controller.signal,
        skipErrorHandler: true,
      });
      if (controller.signal.aborted || currentRequest.current !== controller)
        return { data: [], total: 0, success: false };
      if (!response.success || !response.data) {
        setError(response.message || '获取客户查询记录列表失败');
        return { data: [], total: 0, success: false };
      }
      const { items, total } = response.data;
      if (
        !Array.isArray(items) ||
        typeof total !== 'number' ||
        !Number.isInteger(total) ||
        total < 0 ||
        items.some((item) => !item.orderId)
      ) {
        setError('客户查询记录列表数据格式异常，请稍后重试');
        return { data: [], total: 0, success: false };
      }
      return { data: items, total, success: true };
    } catch {
      if (!controller.signal.aborted && currentRequest.current === controller) {
        setError('获取客户查询记录列表失败，请检查网络或访问权限');
      }
      return { data: [], total: 0, success: false };
    } finally {
      if (currentRequest.current === controller)
        currentRequest.current = undefined;
    }
  }, []);

  const exportOrders = useCallback(async () => {
    if (!lastQuery.current) throw new Error('请先查询客户记录再导出');
    // 接口单页上限为 100；逐页抓取，最多导出 10000 条匹配记录。
    const { page: _page, size: _size, ...filters } = lastQuery.current;
    const controller = new AbortController();
    exportRequest.current = controller;
    const limit = 10000;
    const batchSize = 100;
    const rows: YiyanchaAPI.OrderView[] = [];
    try {
      for (let page = 1; rows.length < limit; page += 1) {
        const response = await listAgentOrders(
          { ...filters, page, size: batchSize },
          { signal: controller.signal, skipErrorHandler: true },
        );
        if (controller.signal.aborted || !response.success || !response.data)
          throw new Error(response.message || '导出客户查询记录失败');
        const { items, total } = response.data;
        if (
          !Array.isArray(items) ||
          typeof total !== 'number' ||
          !Number.isInteger(total) ||
          total < 0 ||
          items.some((item) => !item.orderId)
        )
          throw new Error('导出数据格式异常，请稍后重试');
        const expected = Math.min(total, limit);
        if (items.length === 0 && rows.length < expected)
          throw new Error('导出数据不完整，请稍后重试');
        rows.push(...items.slice(0, limit - rows.length));
        if (rows.length >= expected) return { rows, truncated: total > limit };
      }
      return { rows, truncated: true };
    } finally {
      if (exportRequest.current === controller) exportRequest.current = undefined;
    }
  }, []);

  const reset = useCallback(() => {
    currentRequest.current?.abort();
    currentRequest.current = undefined;
    exportRequest.current?.abort();
    exportRequest.current = undefined;
    lastQuery.current = undefined;
    setError('');
  }, []);
  return { error, requestOrders, exportOrders, reset };
}
