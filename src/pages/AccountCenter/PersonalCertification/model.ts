import { certifications } from '@/services/yiyancha/governance';
import { message } from 'antd';
import { useCallback, useRef, useState } from 'react';
import { CertificationStatus, PAGE_SIZE } from './constants';
import type {
  CertificationOverview,
  CertificationPage,
  CertificationSearchValues,
} from './type';
import { toCertificationRow, toCertificationTime } from './utils';

/** 编排本人认证列表请求、脱敏及业务反馈，不在共享 model 挂载时加载。 */
export default function usePersonalCertificationModel() {
  // 消息实例及由页面挂载的主题上下文。
  const [messageApi, contextHolder] = message.useMessage();
  // 当前查询控制器，用于取消和忽略过期响应。
  const currentRequest = useRef<AbortController>();
  // 统计独立于列表筛选，只保留接口返回的三个总数。
  const [overview, setOverview] = useState<CertificationOverview>({});
  // 概览查询也必须支持刷新竞态和离页取消。
  const overviewRequest = useRef<AbortController>();

  /** 按本人认证范围查询全量、待审核及通过总数，不用当前页计算。 */
  const loadOverview = useCallback(async () => {
    overviewRequest.current?.abort();
    // 本轮统计的取消控制器，与 ProTable 请求分离。
    const controller = new AbortController();
    overviewRequest.current = controller;
    setOverview({});
    try {
      // 第一项为全部个人认证，后两项按正式状态精确统计。
      const responses = await Promise.all(
        [
          undefined,
          CertificationStatus.Pending,
          CertificationStatus.Approved,
        ].map(
          // 每次只读取一条，用分页 total 作为状态总数。
          (status) =>
            certifications(
              { subjectType: 'person', page: 1, size: 1, status },
              { signal: controller.signal, skipErrorHandler: true },
            ),
        ),
      );
      if (controller.signal.aborted || overviewRequest.current !== controller)
        return;
      if (responses.some((response) => !response.success)) return;
      // total 是筛选后的总数；不使用可能跨主体范围的 scopeTotal。
      const totals = responses.map((response) => response.data?.total);
      if (
        totals.some(
          (total) =>
            typeof total !== 'number' || !Number.isInteger(total) || total < 0,
        )
      ) {
        messageApi.error('个人认证统计数据格式异常，请稍后重试');
        return;
      }
      setOverview({
        total: totals[0],
        pending: totals[1],
        approved: totals[2],
      });
    } catch {
      if (!controller.signal.aborted && overviewRequest.current === controller)
        messageApi.error('获取个人认证统计失败，请稍后重试');
    } finally {
      if (overviewRequest.current === controller)
        overviewRequest.current = undefined;
    }
  }, [messageApi]);

  /** 固定查询当前账号的个人认证，筛选值不写日志或 URL。 */
  const requestCertifications = useCallback(
    async (p: CertificationSearchValues): Promise<CertificationPage> => {
      // 仅发送协议允许的参数，不透传可被运行时注入的主体类型。
      const query: YiyanchaAPI.certificationsParams = {
        subjectType: 'person',
        page: p.current ?? 1,
        size: p.pageSize ?? PAGE_SIZE,
        applicantName: p.applicantName?.trim() || undefined,
        applicantPhone: p.applicantPhone?.trim() || undefined,
        identity: p.identity?.trim() || undefined,
        minDocuments: p.minDocuments,
        maxDocuments: p.maxDocuments,
        submittedFrom: toCertificationTime(p.submittedFrom),
        submittedTo: toCertificationTime(p.submittedTo),
        status: p.status || undefined,
      };
      currentRequest.current?.abort();
      // 本次查询独立的取消信号。
      const controller = new AbortController();
      currentRequest.current = controller;
      try {
        // 生成接口返回的业务响应，业务失败由全局拦截器提示。
        const response = await certifications(query, {
          signal: controller.signal,
          skipErrorHandler: true,
        });
        if (controller.signal.aborted || currentRequest.current !== controller)
          return { data: [], total: 0, success: false };
        if (!response.success) return { data: [], total: 0, success: false };
        // 使用筛选总数，不能以当前页数量或 scopeTotal 替代。
        const { items, total } = response.data ?? {};
        if (
          !Array.isArray(items) ||
          typeof total !== 'number' ||
          !Number.isInteger(total) ||
          total < 0 ||
          items.some((item) => !item || !item.id)
        ) {
          messageApi.error('个人认证记录数据格式异常，请稍后重试');
          return { data: [], total: 0, success: false };
        }
        void loadOverview();
        return { data: items.map(toCertificationRow), total, success: true };
      } catch {
        if (!controller.signal.aborted && currentRequest.current === controller)
          messageApi.error('获取个人认证记录失败，请检查网络或访问权限');
        return { data: [], total: 0, success: false };
      } finally {
        if (currentRequest.current === controller)
          currentRequest.current = undefined;
      }
    },
    [loadOverview, messageApi],
  );

  /** 暂未开放的认证办理和详情操作仅提示，不请求或提交。 */
  const showAction = useCallback(
    (action: string) => {
      messageApi.info(`${action}功能暂不可用`);
    },
    [messageApi],
  );

  /** 离页取消请求，避免共享 model 在卸载后继续反馈。 */
  const reset = useCallback(() => {
    currentRequest.current?.abort();
    currentRequest.current = undefined;
    overviewRequest.current?.abort();
    overviewRequest.current = undefined;
    setOverview({});
  }, []);

  return { contextHolder, overview, requestCertifications, showAction, reset };
}
