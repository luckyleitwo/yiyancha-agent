import { dateTime } from '@/utils/businessFormat';
import type { ExcelColumn } from '@/utils/exportExcel';

// 列表默认每页展示条数。
export const PAGE_SIZE = 20;
// 一次 Excel 导出允许累计的最大记录数。
export const EXPORT_LIMIT = 10000;
// 导出每次请求的条数，对应接口单页最大值。
export const EXPORT_PAGE_SIZE = 100;

// 授权状态保持后端取值，页面按业务要求显示完成情况。
export const AUTHORIZATION_STATUS_LABELS: Record<string, string> = {
  pending: '未完成',
  active: '已完成',
  revoked: '已取消',
};
// 由统一状态映射生成的搜索下拉选项。
export const AUTHORIZATION_STATUS_OPTIONS = Object.entries(
  AUTHORIZATION_STATUS_LABELS,
).map(([value, label]) => ({ value, label }));

// Excel 列配置，复用列表的状态含义及日期格式。
export const ORDER_EXPORT_COLUMNS: ExcelColumn<YiyanchaAPI.OrderView>[] = [
  { header: '订单编号', value: (row) => row.orderId, width: 36 },
  { header: '批次号', value: (row) => row.batchNo, width: 36 },
  { header: '核验对象', value: (row) => row.subjectName, width: 20 },
  { header: '所属企业', value: (row) => row.companyName, width: 30 },
  { header: '核验产品', value: (row) => row.productName, width: 24 },
  { header: '数量', value: (row) => row.quantity, width: 12 },
  {
    header: '订单金额（元）',
    value: (row) => row.amount,
    numFmt: '#,##0.00',
    width: 20,
  },
  {
    header: '完成情况',
    value: (row) =>
      AUTHORIZATION_STATUS_LABELS[row.authorizationStatus ?? ''] ??
      row.authorizationStatus,
    width: 14,
  },
  { header: '创建时间', value: (row) => dateTime(row.createdAt), width: 24 },
];
