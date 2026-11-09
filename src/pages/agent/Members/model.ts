import { users } from '@/services/yiyancha/identity';
import { getLoginSession } from '@/utils/auth';
import { useCallback, useRef, useState } from 'react';
import { PAGE_SIZE } from './constants';

import type { Filters } from './types';
// 管理客户账号筛选和范围总数；列表数据交给 ProTable。
export default function useMembersModel() {
  const [status, setStatus] = useState('');
  const [scopeTotal, setScopeTotal] = useState<number>();
  const [error, setError] = useState('');
  const requestId = useRef(0);
  const requestMembers = useCallback(async (params: Filters) => {
    const id = ++requestId.current;
    setError('');
    try {
      // 按当前登录缓存的门户筛选，不将缺失门户视作查询全部。
      const portal = getLoginSession()?.portal;
      if (!portal) {
        if (id === requestId.current) {
          setScopeTotal(undefined);
          setError('登录信息缺少所属端，请重新登录');
        }
        return { data: [], total: 0, success: false };
      }
      const result = await users(
        {
          portal,
          page: params.current ?? 1,
          pageSize: params.pageSize ?? PAGE_SIZE,
          displayName: params.displayName?.trim() || undefined,
          loginName: params.loginName?.trim() || undefined,
          email: params.email?.trim() || undefined,
          companyId: params.companyId?.trim() || undefined,
          companyName: params.companyName?.trim() || undefined,
          agentName: params.agentName?.trim() || undefined,
          department: params.department?.trim() || undefined,
          roleId: params.roleId?.trim() || undefined,
          status: params.status || undefined,
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
        setError('获取客户账号失败，请检查网络或访问权限');
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
  return { status, setStatus, scopeTotal, error, requestMembers, reset };
}
