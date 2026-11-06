import { queryDashboard } from '@/services/adminDashboard';
import {
  applyCancellation,
  requestError,
} from '@/services/adminDashboard/state';
import type {
  CancellationResult,
  DashboardResponse,
} from '@/services/adminDashboard/types';
import { useCallback, useRef, useState } from 'react';

export default function useBusinessSnapshot() {
  const [snapshot, setSnapshot] = useState<DashboardResponse>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [updatedAt, setUpdatedAt] = useState<number>();
  const currentRequest = useRef<AbortController>();
  const load = useCallback(async () => {
    currentRequest.current?.abort();
    const controller = new AbortController();
    currentRequest.current = controller;
    setLoading(true);
    setError('');
    try {
      const response = await queryDashboard(controller.signal);
      if (controller.signal.aborted) return false;
      setSnapshot(response);
      setUpdatedAt(Date.now());
      return true;
    } catch (cause) {
      if (!controller.signal.aborted)
        setError(requestError(cause, '业务数据加载失败，请检查服务后重试。'));
      return false;
    } finally {
      if (currentRequest.current === controller) setLoading(false);
    }
  }, []);
  const cancel = useCallback(() => {
    currentRequest.current?.abort();
    currentRequest.current = undefined;
    setLoading(false);
  }, []);
  const commitCancellation = useCallback(
    async (result: CancellationResult) => {
      // 先使旧查询失效并合并已确认的写入，刷新失败也不回退到可重复撤回的旧状态。
      cancel();
      setSnapshot(
        (previous) => previous && applyCancellation(previous, result),
      );
      return load();
    },
    [cancel, load],
  );
  return {
    snapshot,
    data: snapshot?.data,
    loading,
    error,
    updatedAt,
    load,
    cancel,
    commitCancellation,
  };
}
