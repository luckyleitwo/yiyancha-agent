// 提现列表默认每页条数。
export const PAGE_SIZE = 20;

// 后端已确认的提现状态编码，对应原型的业务中文。
export enum WithdrawalStatus {
  Pending = 'pending',
  Approved = 'approved',
  Paid = 'paid',
  Rejected = 'rejected',
}

// 状态展示映射，未知状态由调用方保留原值。
export const WITHDRAWAL_STATUS_LABELS: Record<string, string> = {
  [WithdrawalStatus.Pending]: '待审核',
  [WithdrawalStatus.Approved]: '待打款',
  [WithdrawalStatus.Paid]: '已打款',
  [WithdrawalStatus.Rejected]: '已驳回',
};

// 从统一映射派生可清除的状态筛选选项。
export const WITHDRAWAL_STATUS_OPTIONS = Object.entries(
  WITHDRAWAL_STATUS_LABELS,
).map(([value, label]) => ({ value, label }));
