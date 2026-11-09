import { dashboard } from '@/services/yiyancha/catalog';
import { useCallback, useRef, useState } from 'react';

// 首页统计由进入页面时主动加载，model 不在全局初始化时发起请求。
export default function useHomeModel() {
  const [data, setData] = useState<YiyanchaAPI.Dashboard>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  // 新请求或离页重置后，旧响应不得覆盖当前状态。
  const requestId = useRef(0);
  const load = useCallback(async () => {
    const id = ++requestId.current;
    setLoading(true);
    setError(false);
    try {
      const result = await dashboard({ skipErrorHandler: true });
      if (!result.success || !result.data) throw new Error('获取首页数据失败');
      if (id === requestId.current) setData(result.data);
    } catch {
      if (id === requestId.current) {
        setData(undefined);
        setError(true);
      }
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, []);
  const reset = useCallback(() => {
    requestId.current += 1;
    setData(undefined);
    setLoading(false);
    setError(false);
  }, []);
  return { data, loading, error, load, reset };
}
