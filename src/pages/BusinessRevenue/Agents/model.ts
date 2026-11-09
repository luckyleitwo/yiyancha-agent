import { listAgents } from '@/services/yiyancha/catalog';
import { useCallback, useRef, useState } from 'react';

// 列表和 loading 归 ProTable；model 负责请求竞态和错误处理。
export default function useAgentsModel() {
  const [error, setError] = useState('');
  const currentRequest = useRef<AbortController>();
  const requestAgents = useCallback(
    async (query: YiyanchaAPI.listAgentsParams) => {
      // 新查询取消旧请求；固定只查询下级，不能由表单覆盖。
      currentRequest.current?.abort();
      const controller = new AbortController();
      currentRequest.current = controller;
      setError('');
      try {
        const response = await listAgents(
          { ...query, descendantsOnly: true },
          { signal: controller.signal, skipErrorHandler: true },
        );
        if (controller.signal.aborted || currentRequest.current !== controller)
          return { data: [], total: 0, success: false };
        // 业务失败由全局响应拦截器提示，避免重复弹消息。
        if (!response.success) return { data: [], total: 0, success: false };
        const { items, total } = response.data ?? {};
        if (
          !Array.isArray(items) ||
          typeof total !== 'number' ||
          !Number.isInteger(total) ||
          total < 0 ||
          items.some((item) => !item.id)
        ) {
          setError('下级代理列表数据格式异常，请稍后重试');
          return { data: [], total: 0, success: false };
        }
        return { data: items, total, success: true };
      } catch {
        if (!controller.signal.aborted && currentRequest.current === controller)
          setError('获取下级代理失败，请检查网络或访问权限');
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
  return { error, requestAgents, reset };
}
