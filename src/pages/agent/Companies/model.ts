import { listCompanies } from '@/services/yiyancha/catalog';
import { useCallback, useRef, useState } from 'react';
import { PAGE_SIZE } from './constants';

import type { Filters } from './types';
// ProTable 管理列表与加载状态；model 负责查询映射和范围总数。
export default function useCompaniesModel() {
  const [status, setStatus] = useState('');
  const [scopeTotal, setScopeTotal] = useState<number>();
  const [error, setError] = useState('');
  // scopeTotal 不受筛选影响；只接受最近一次请求的统计结果。
  const requestId = useRef(0);
  const requestCompanies = useCallback(async (params: Filters) => {
    const id = ++requestId.current;
    setError('');
    try {
      const result = await listCompanies(
        {
          page: params.current ?? 1,
          pageSize: params.pageSize ?? PAGE_SIZE,
          keyword: params.keyword?.trim() || undefined,
          name: params.name?.trim() || undefined,
          contactName: params.contactName?.trim() || undefined,
          phone: params.phone?.trim() || undefined,
          industry: params.industry || undefined,
          agentId: params.agentId?.trim() || undefined,
          certificationStatus: params.certificationStatus || undefined,
          includeDemo: params.includeDemo !== 'false',
          onlyMine: params.onlyMine === 'true',
        },
        { skipErrorHandler: true },
      );
      if (!result.success || !result.data) {
        if (id === requestId.current) setScopeTotal(undefined);
        return { data: [], total: 0, success: false };
      }
      if (id === requestId.current) setScopeTotal(result.data.scopeTotal);
      return {
        data: result.data.items ?? [],
        total: result.data.total ?? 0,
        success: true,
      };
    } catch {
      if (id === requestId.current) {
        setScopeTotal(undefined);
        setError('获取企业客户失败，请检查网络或访问权限');
      }
      return { data: [], total: 0, success: false };
    }
  }, []);
  const reset = useCallback(() => {
    requestId.current += 1;
    setStatus('');
    setScopeTotal(undefined);
    setError('');
  }, []);
  return { status, setStatus, scopeTotal, error, requestCompanies, reset };
}
