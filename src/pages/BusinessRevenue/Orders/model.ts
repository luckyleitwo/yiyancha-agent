import { listOrders1 } from '@/services/yiyancha/agents';
import { exportExcel } from '@/utils/exportExcel';
import { message } from 'antd';
import { useCallback, useRef, useState } from 'react';
import {
  EXPORT_LIMIT,
  EXPORT_PAGE_SIZE,
  ORDER_EXPORT_COLUMNS,
  PAGE_SIZE,
} from './constants';
import type { OrderQuery, OrderSearchValues } from './types';

// 日期控件使用本地时间，接口接收 ISO 日期时间。
function toIsoDate(value?: string) {
  if (!value) return undefined;
  // 根据本地日期时间构造日期对象，再转换为接口使用的 ISO 时间。
  const date = new Date(value.replace(' ', 'T'));
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

/** 管理客户查询记录的筛选、分页请求与 Excel 导出及反馈。 */
export default function useOrdersModel() {
  // 业务结果消息实例及由页面挂载的主题上下文节点。
  const [messageApi, contextHolder] = message.useMessage();
  // 当前列表查询的网络或数据格式错误。
  const [error, setError] = useState('');
  // 覆盖取数和生成 Excel 全过程的导出状态。
  const [exporting, setExporting] = useState(false);
  // 当前有效的列表请求，用于取消和忽略过期结果。
  const currentRequest = useRef<AbortController>();
  // 独立的导出请求，同时作为重复点击的同步锁。
  const exportRequest = useRef<AbortController>();
  // 最近成功提交的完整筛选条件，避免导出未提交的表单草稿。
  const lastQuery = useRef<OrderQuery>();

  /** 转换表格搜索值，通过生成接口查询当前页记录。 */
  const requestOrders = useCallback(async (p: OrderSearchValues) => {
    // 从表格字段映射生成协议，仅发送页面支持的筛选条件。
    const query: OrderQuery = {
      orderId: p.orderId?.trim() || undefined,
      batchNo: p.batchNo?.trim() || undefined,
      companyId: p.companyId?.trim() || undefined,
      companyName: p.companyName?.trim() || undefined,
      subjectName: p.subjectName?.trim() || undefined,
      productId: p.productId?.trim() || undefined,
      productName: p.productName?.trim() || undefined,
      agentName: p.agentName?.trim() || undefined,
      minQuantity: p.minQuantity,
      maxQuantity: p.maxQuantity,
      minPaid: p.minPaid,
      maxPaid: p.maxPaid,
      createdFrom: toIsoDate(p.createdFrom),
      createdTo: toIsoDate(p.createdTo),
      authorizationStatus: p.authorizationStatus?.trim() || undefined,
      includeDemo:
        p.includeDemo === undefined ? undefined : p.includeDemo === 'true',
      page: p.current ?? 1,
      size: p.pageSize ?? PAGE_SIZE,
    };
    currentRequest.current?.abort();
    // 本次列表请求的取消控制器。
    const controller = new AbortController();
    currentRequest.current = controller;
    lastQuery.current = undefined;
    setError('');
    try {
      // 生成接口返回的原始业务响应。
      const response = await listOrders1(query, {
        signal: controller.signal,
        skipErrorHandler: true,
      });
      if (controller.signal.aborted || currentRequest.current !== controller)
        return { data: [], total: 0, success: false };
      // 业务失败由全局响应拦截器提示，避免页面再次弹错。
      if (!response.success) return { data: [], total: 0, success: false };
      if (!response.data) {
        setError(response.message || '获取客户查询记录列表失败');
        return { data: [], total: 0, success: false };
      }
      // 当前页记录和筛选后的总数，用于列表及分页。
      const { items, total } = response.data;
      if (
        !Array.isArray(items) ||
        typeof total !== 'number' ||
        !Number.isInteger(total) ||
        total < 0 ||
        items.some((item) => !item.orderId)
      ) {
        setError('客户查询记录列表数据格式异常，请稍后重试');
        return { data: [], total: 0, success: false };
      }
      // 导出复用最近成功提交的条件，不读取表单草稿。
      lastQuery.current = { ...query };
      return { data: items, total, success: true };
    } catch {
      if (!controller.signal.aborted && currentRequest.current === controller)
        setError('获取客户查询记录列表失败，请检查网络或访问权限');
      return { data: [], total: 0, success: false };
    } finally {
      if (currentRequest.current === controller)
        currentRequest.current = undefined;
    }
  }, []);

  /** 使用已提交条件导出 Excel，统一处理空数据、上限及操作结果消息。 */
  const exportOrders = useCallback(async (): Promise<void> => {
    if (exportRequest.current) return;
    if (!lastQuery.current) {
      messageApi.info('请先查询客户记录再导出');
      return;
    }
    // 导出固定查询快照，移除列表页码并从第一页重新抓取。
    const filters = { ...lastQuery.current };
    delete filters.page;
    delete filters.size;
    // 本次导出的取消控制器，不影响列表查询。
    const controller = new AbortController();
    exportRequest.current = controller;
    setExporting(true);
    // 按接口顺序累计的导出记录，总数不超过导出上限。
    const rows: YiyanchaAPI.OrderView[] = [];
    // 已收到的业务主键，用于检测重复分页数据。
    const ids = new Set<string>();
    // 首次导出响应的匹配总数，用于检测取数期间的数据变化。
    let matchedTotal: number | undefined;
    try {
      // 导出页码从 1 递增，不沿用列表当前页。
      for (let page = 1; rows.length < EXPORT_LIMIT; page += 1) {
        // 当前批次的原始分页响应。
        const response = await listOrders1(
          { ...filters, page, size: EXPORT_PAGE_SIZE },
          { signal: controller.signal, skipErrorHandler: true },
        );
        if (controller.signal.aborted) return;
        // 明确业务失败已由全局拦截器反馈，此处仅停止导出。
        if (!response.success) return;
        if (!response.data)
          throw new Error(response.message || '导出客户查询记录失败');
        // 当前批次的记录、匹配总数和接口回传的分页信息。
        const {
          items,
          total,
          page: resultPage,
          size: resultSize,
        } = response.data;
        if (
          !Array.isArray(items) ||
          typeof total !== 'number' ||
          !Number.isInteger(total) ||
          total < 0 ||
          items.some((item) => !item.orderId) ||
          (resultPage !== undefined && resultPage !== page) ||
          (resultSize !== undefined && resultSize !== EXPORT_PAGE_SIZE)
        )
          throw new Error('导出数据格式异常，请稍后重试');
        if (matchedTotal !== undefined && total !== matchedTotal)
          throw new Error('导出期间记录总数发生变化，请重新查询后再试');
        matchedTotal = total;
        // 当前筛选条件允许导出的目标条数，最多 10000 条。
        const expected = Math.min(total, EXPORT_LIMIT);
        if (items.length !== Math.min(EXPORT_PAGE_SIZE, expected - rows.length))
          throw new Error('导出数据不完整，请重新查询后再试');
        // 逐条校验记录主键，防止重复记录掩盖缺页。
        for (const item of items) {
          if (!item.orderId || ids.has(item.orderId))
            throw new Error('导出数据存在重复记录，请重新查询后再试');
          ids.add(item.orderId);
        }
        rows.push(...items);
        if (rows.length === expected) {
          if (rows.length)
            await exportExcel({
              fileName: '客户查询记录',
              sheetName: '客户查询记录',
              data: rows,
              columns: ORDER_EXPORT_COLUMNS,
            });
          if (controller.signal.aborted) return;
          if (!rows.length) messageApi.info('暂无可导出的记录');
          else if (total > EXPORT_LIMIT)
            messageApi.warning(
              `匹配记录超过 ${EXPORT_LIMIT} 条，仅导出前 ${EXPORT_LIMIT} 条`,
            );
          else messageApi.success(`已导出 ${rows.length} 条记录`);
          return;
        }
      }
      throw new Error('导出数据不完整，请重新查询后再试');
    } catch (cause) {
      // 仅反馈未取消操作的异常；主动离页不弹失败提示。
      if (!controller.signal.aborted)
        messageApi.error(
          cause instanceof Error ? cause.message : '导出失败，请重试',
        );
    } finally {
      if (exportRequest.current === controller) {
        exportRequest.current = undefined;
        setExporting(false);
      }
    }
  }, [messageApi]);

  /** 离页时取消请求并清理共享的查询、错误及导出状态。 */
  const reset = useCallback(() => {
    currentRequest.current?.abort();
    currentRequest.current = undefined;
    exportRequest.current?.abort();
    exportRequest.current = undefined;
    lastQuery.current = undefined;
    setExporting(false);
    setError('');
  }, []);
  return {
    messageApi,
    contextHolder,
    error,
    exporting,
    requestOrders,
    exportOrders,
    reset,
  };
}
