export const PAGE_SIZE = 20;
// 分佣配置状态与文案由用户确认，查询时传后端原始值。
export const POLICY_STATUS_LABELS: Record<string, string> = {
  active: '生效中',
  disabled: '已停用',
  pending: '待审核',
  draft: '草稿',
};
export const POLICY_STATUS_OPTIONS = Object.entries(POLICY_STATUS_LABELS).map(
  ([value, label]) => ({ value, label }),
);
