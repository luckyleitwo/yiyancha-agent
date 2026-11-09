import { listProducts } from '@/services/yiyancha/catalog';
import { useCallback, useRef, useState } from 'react';

import { PAGE_SIZE } from './constants';
// 管理产品卡片列表的服务端分页、加载与错误状态。
export default function useCatalogModel() {
  const [rows, setRows] = useState<YiyanchaAPI.Product[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // 切页或离页后丢弃旧请求结果，避免覆盖当前页。
  const requestId = useRef(0);
  const load = useCallback(async (currentPage: number) => {
    const id = ++requestId.current;
    setLoading(true);
    setError('');
    try {
      const result = await listProducts(
        { page: currentPage, pageSize: PAGE_SIZE, status: 'active' },
        { skipErrorHandler: true },
      );
      if (!result.success || !result.data)
        throw new Error(result.message || '获取产品列表失败，请稍后重试');
      if (id === requestId.current) {
        setRows(result.data.items ?? []);
        setTotal(result.data.total ?? 0);
      }
    } catch (cause) {
      if (id === requestId.current) {
        setRows([]);
        setTotal(0);
        setError(
          cause instanceof Error
            ? cause.message
            : '获取产品列表失败，请检查网络或访问权限',
        );
      }
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, []);
  const reset = useCallback(() => {
    requestId.current += 1;
    setRows([]);
    setPage(1);
    setTotal(0);
    setLoading(false);
    setError('');
  }, []);
  return { rows, page, total, loading, error, setPage, load, reset };
}
