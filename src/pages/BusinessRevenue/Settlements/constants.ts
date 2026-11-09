// 收益明细列表的默认每页条数。
export const PAGE_SIZE = 20;
// 状态枚举及业务口径由用户确认，筛选使用接口状态值。
export const SETTLEMENT_STATUS_LABELS: Record<string, string> = {
  pending: '待结算',
  ready: '可结算',
  completed: '已结算',
  reversed: '退款冲回',
};
// 由统一状态映射生成的搜索下拉选项。
export const SETTLEMENT_STATUS_OPTIONS = Object.entries(
  SETTLEMENT_STATUS_LABELS,
).map(([value, label]) => ({ value, label }));
