import { ownWithdrawals } from '@/services/yiyancha/finance';
import { message } from 'antd';
import { useCallback, useRef } from 'react';
import { PAGE_SIZE } from './constants';
import type { WithdrawalQuery, WithdrawalSearchValues } from './type';

/** 管理提现筛选、请求生命周期和业务提示；列表数据由 ProTable 持有。 */
export default function useWithdrawalsModel() {
  // 消息实例和由页面挂载的主题上下文节点。
  const [messageApi, contextHolder] = message.useMessage();
  // 当前有效的查询，用于取消旧请求和忽略过期响应。
  const currentRequest = useRef<AbortController>();

  /** 按已提交条件分页查询本人及下属代理的提现记录。 */
  const requestWithdrawals = useCallback(
    async (p: WithdrawalSearchValues) => {
      // 按生成协议转换数字，完整账户用于精确匹配，不记录到日志。
      const query: WithdrawalQuery = {
        agentId: p.agentId?.trim() || undefined,
        agentName: p.agentName?.trim() || undefined,
        amountMin: p.amountMin?.toString(),
        amountMax: p.amountMax?.toString(),
        bankAccount: p.bankAccount?.trim() || undefined,
        payoutReference: p.payoutReference?.trim() || undefined,
        createdFrom: p.createdFrom || undefined,
        createdTo: p.createdTo || undefined,
        status: p.status || undefined,
        includeDemo: p.includeDemo,
        page: String(p.current ?? 1),
        pageSize: String(p.pageSize ?? PAGE_SIZE),
      };
      currentRequest.current?.abort();
      // 此次查询独立的取消控制器。
      const controller = new AbortController();
      currentRequest.current = controller;
      try {
        // 生成接口的业务响应，业务失败提示由全局拦截器处理。
        const response = await ownWithdrawals(query, {
          signal: controller.signal,
          skipErrorHandler: true,
        });
        if (controller.signal.aborted || currentRequest.current !== controller)
          return { data: [], total: 0, success: false };
        if (!response.success) return { data: [], total: 0, success: false };
        // 当前页记录和筛选后的总数，不使用数组长度代替分页总数。
        const { items, total } = response.data ?? {};
        if (
          !Array.isArray(items) ||
          typeof total !== 'number' ||
          !Number.isInteger(total) ||
          total < 0 ||
          items.some((item) => !item.id)
        ) {
          messageApi.error('提现记录数据格式异常，请稍后重试');
          return { data: [], total: 0, success: false };
        }
        return { data: items, total, success: true };
      } catch {
        if (!controller.signal.aborted && currentRequest.current === controller)
          messageApi.error('获取提现记录失败，请检查网络或访问权限');
        return { data: [], total: 0, success: false };
      } finally {
        if (currentRequest.current === controller)
          currentRequest.current = undefined;
      }
    },
    [messageApi],
  );

  /** 对暂未开放的操作仅作提示，不查询详情、不写入或下载文件。 */
  const showAction = useCallback(
    (action: string) => {
      messageApi.info(`${action}功能暂不可用`);
    },
    [messageApi],
  );

  /** 离页时取消请求，防止共享 model 在页面卸载后继续反馈结果。 */
  const reset = useCallback(() => {
    currentRequest.current?.abort();
    currentRequest.current = undefined;
  }, []);

  return { contextHolder, requestWithdrawals, showAction, reset };
}
