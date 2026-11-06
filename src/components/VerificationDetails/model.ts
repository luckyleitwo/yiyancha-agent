import { cancelMockOrder } from '@/services/adminDashboard';
import { requestError } from '@/services/adminDashboard/state';
import type {
  CancellationResult,
  DashboardResponse,
} from '@/services/adminDashboard/types';
import { useEffect, useRef, useState } from 'react';

export default function useVerificationDetailsModel(
  snapshot: DashboardResponse,
  onCommitted: (result: CancellationResult) => Promise<boolean>,
) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const locked = useRef(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const canCancel =
    snapshot.mode === 'mock' && snapshot.capabilities?.cancelOrder === true;
  const confirm = async (id: string) => {
    if (locked.current) return undefined;
    if (!canCancel) {
      setError('未启用撤回权限；正式服务尚未接入。');
      return undefined;
    }
    locked.current = true;
    setSaving(true);
    setError('');
    try {
      const result = await cancelMockOrder(id);
      // 写入成功与后续读取分开处理，不能把刷新失败误报成撤回失败。
      let refreshed = false;
      try {
        refreshed = await onCommitted(result);
      } catch {
        refreshed = false;
      }
      return { refreshed };
    } catch (cause) {
      if (mounted.current)
        setError(
          requestError(
            cause,
            '撤回请求未能确认成功，请刷新核实订单状态后再操作。',
          ),
        );
      return undefined;
    } finally {
      locked.current = false;
      if (mounted.current) setSaving(false);
    }
  };
  return { saving, error, canCancel, confirm, clearError: () => setError('') };
}
