export const PAGE_SIZE = 20;
export const OPENING_STATUS_MAP: Record<
  string,
  { label: string; color: string; background: string }
> = {
  pending: { label: '待审核', color: '#cb963b', background: '#fff5e5' },
  approved: { label: '已开通', color: '#42a38b', background: '#eaf6f1' },
  rejected: { label: '已驳回', color: '#cf6c72', background: '#fff0f1' },
};
export const OPENING_STATUS_DEFAULT = {
  color: '#8b77d0',
  background: '#f0eefb',
};
export const OPENING_STATUSES = Object.entries(OPENING_STATUS_MAP).map(
  ([value, item]) => ({ value, label: item.label }),
);
