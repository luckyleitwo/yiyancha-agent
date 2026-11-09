import { agentRecharges } from '@/services/yiyancha/agents';
import { useCallback, useRef, useState } from 'react';
import { PAGE_SIZE } from './constants';
import type { RechargeQuery, RechargeSearchValues } from './types';

/** 管理客户充值查询的参数转换和请求生命周期，列表由 ProTable 持有。 */
export default function useRechargesModel() {
  // 当前查询的网络或数据格式错误，由页面负责展示。
  const [error, setError] = useState('');
  // 当前有效的列表请求，用于取消查询并识别过期响应。
  const currentRequest = useRef<AbortController>();

  /** 转换表格筛选条件，通过生成接口查询客户充值记录。 */
  const requestRecharges = useCallback(async (p: RechargeSearchValues) => {
    // 分页、金额和示例范围遵循生成协议的字符串类型。
    const query: RechargeQuery = {
      keyword: p.keyword?.trim() || undefined,
      companyName: p.companyName?.trim() || undefined,
      amountMin: p.amountMin?.toString(),
      amountMax: p.amountMax?.toString(),
      paymentMethod: p.paymentMethod?.trim() || undefined,
      paymentReference: p.paymentReference?.trim() || undefined,
      paymentDateFrom: p.paymentDateFrom || undefined,
      paymentDateTo: p.paymentDateTo || undefined,
      includeDemo: p.includeDemo,
      status: p.status || undefined,
      page: String(p.current ?? 1),
      pageSize: String(p.pageSize ?? PAGE_SIZE),
    };
    currentRequest.current?.abort();
    // 本次请求的取消控制器，不与其他查询共享。
    const controller = new AbortController();
    currentRequest.current = controller;
    setError('');
    try {
      // 生成接口返回的原始业务响应。
      const response = await agentRecharges(query, {
        signal: controller.signal,
        skipErrorHandler: true,
      });
      if (controller.signal.aborted || currentRequest.current !== controller)
        return { data: [], total: 0, success: false };
      // 明确的业务失败由全局响应拦截器提示，不再重复弹错。
      if (!response.success) return { data: [], total: 0, success: false };
      // 当前页充值记录及筛选后的总数，用于列表分页。
      const { items, total } = response.data ?? {};
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
      if (!controller.signal.aborted && currentRequest.current === controller)
        setError('获取客户充值记录失败，请检查网络或访问权限');
      return { data: [], total: 0, success: false };
    } finally {
      if (currentRequest.current === controller)
        currentRequest.current = undefined;
    }
  }, []);

  /** 离页时取消请求并清理共享 model 的错误状态。 */
  const reset = useCallback(() => {
    currentRequest.current?.abort();
    currentRequest.current = undefined;
    setError('');
  }, []);
  return { error, requestRecharges, reset };
}
