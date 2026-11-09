export const PAGE_SIZE = 20;
// 取值参考代理创建请求；列表筛选仍需联调确认。
export const AGENT_TYPES = [
  { value: 'ENTERPRISE', label: '企业代理' },
  { value: 'INDIVIDUAL', label: '个人代理' },
];

// 代理经营状态及展示文案由用户确认。
export const AGENT_STATUS_LABELS: Record<string, string> = {
  pending: '待审核',
  active: '已通过',
  disabled: '已停用',
};
export const AGENT_STATUS_OPTIONS = Object.entries(AGENT_STATUS_LABELS).map(
  ([value, label]) => ({ value, label }),
);
