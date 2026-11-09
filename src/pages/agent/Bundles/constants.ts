export const PAGE_SIZE = 20;

// 仅提供代理端接口对照表已确认支持的状态筛选。
export const BUNDLE_STATUS_MAP: Record<
  string,
  { label: string; color: string; background: string }
> = {
  active: { label: '已上架', color: '#42a38b', background: '#eaf6f1' },
  disabled: { label: '已停用', color: '#9999aa', background: '#f0f1f5' },
};
export const BUNDLE_STATUS_DEFAULT = {
  color: '#8b77d0',
  background: '#f0eefb',
};
export const BUNDLE_STATUSES = Object.entries(BUNDLE_STATUS_MAP).map(
  ([value, item]) => ({ value, label: item.label }),
);
