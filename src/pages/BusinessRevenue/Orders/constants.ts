// 授权状态保持后端取值，页面按业务要求显示完成情况。
export const AUTHORIZATION_STATUS_LABELS: Record<string, string> = {
  pending: '未完成',
  active: '已完成',
  revoked: '已取消',
};
export const AUTHORIZATION_STATUS_OPTIONS = Object.entries(
  AUTHORIZATION_STATUS_LABELS,
).map(([value, label]) => ({ value, label }));
