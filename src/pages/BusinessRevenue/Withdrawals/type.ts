// 从生成协议中选取当前页面已确认的提现筛选参数。
export type WithdrawalQuery = Pick<
  YiyanchaAPI.ownWithdrawalsParams,
  | 'page'
  | 'pageSize'
  | 'agentId'
  | 'agentName'
  | 'amountMin'
  | 'amountMax'
  | 'bankAccount'
  | 'payoutReference'
  | 'createdFrom'
  | 'createdTo'
  | 'status'
  | 'includeDemo'
>;

// 搜索表单采用数字分页及金额，由 model 映射为生成协议的字符串。
export type WithdrawalSearchValues = Omit<
  WithdrawalQuery,
  'page' | 'pageSize' | 'amountMin' | 'amountMax'
> & {
  /** 表格当前页码，从 1 开始。 */
  current?: number;
  /** 表格每页条数。 */
  pageSize?: number;
  /** 最低提现金额，保留合法的 0。 */
  amountMin?: number;
  /** 最高提现金额。 */
  amountMax?: number;
};
