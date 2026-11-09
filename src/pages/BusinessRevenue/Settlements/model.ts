import { ownSettlements } from '@/services/yiyancha/finance';
import { useCallback, useRef, useState } from 'react';
import { PAGE_SIZE } from './constants';
import type { SettlementQuery, SettlementSearchValues } from './types';

/** 管理收益明细的查询参数、请求生命周期和列表错误。 */
export default function useSettlementsModel() {
  // 留给页面展示的网络或响应格式错误。
  const [error, setError] = useState('');
  // 当前有效的列表请求，用于取消和识别过期响应。
  const currentRequest = useRef<AbortController>();

  /** 转换表格条件，通过生成接口查询本人及下属代理结算记录。 */
  const requestSettlements = useCallback(async (p: SettlementSearchValues) => {
    // 仅发送页面支持的筛选字段；分页及金额按生成协议转成字符串。
    const query: SettlementQuery = {
      keyword: p.keyword?.trim() || undefined,
      agentId: p.agentId?.trim() || undefined,
      agentName: p.agentName?.trim() || undefined,
      amountMin: p.amountMin?.toString(),
      amountMax: p.amountMax?.toString(),
      periodLabel: p.periodLabel?.trim() || undefined,
      periodStart: p.periodStart || undefined,
      periodEnd: p.periodEnd || undefined,
      reference: p.reference?.trim() || undefined,
      orderId: p.orderId?.trim() || undefined,
      createdFrom: p.createdFrom || undefined,
      createdTo: p.createdTo || undefined,
      status: p.status || undefined,
      includeDemo: p.includeDemo,
      page: String(p.current ?? 1),
      pageSize: String(p.pageSize ?? PAGE_SIZE),
    };
    currentRequest.current?.abort();
    // 此次请求的取消控制器，不与其他查询共享。
    const controller = new AbortController();
    currentRequest.current = controller;
    setError('');
    try {
      // 生成接口返回的原始业务响应。
      const response = await ownSettlements(query, {
        signal: controller.signal,
        skipErrorHandler: true,
      });
      if (controller.signal.aborted || currentRequest.current !== controller)
        return { data: [], total: 0, success: false };
      // 明确的业务失败已由全局响应拦截器提示，不重复弹消息。
      if (!response.success) return { data: [], total: 0, success: false };
      // 当前页记录与筛选后的总条数，用于 ProTable 分页。
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

  /** 离开页面时取消请求并清理共享 model 状态。 */
  const reset = useCallback(() => {
    currentRequest.current?.abort();
    currentRequest.current = undefined;
    setError('');
  }, []);
  return { error, requestSettlements, reset };
}
