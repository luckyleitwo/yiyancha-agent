// 从生成协议中选取收益明细页面使用的查询字段。
export type SettlementQuery = Pick<
  YiyanchaAPI.ownSettlementsParams,
  | 'page'
  | 'pageSize'
  | 'keyword'
  | 'agentId'
  | 'agentName'
  | 'amountMin'
  | 'amountMax'
  | 'periodLabel'
  | 'periodStart'
  | 'periodEnd'
  | 'reference'
  | 'orderId'
  | 'createdFrom'
  | 'createdTo'
  | 'status'
  | 'includeDemo'
>;

// 表格使用数字分页和金额，由 model 转成生成协议要求的字符串。
export type SettlementSearchValues = Omit<
  SettlementQuery,
  'page' | 'pageSize' | 'amountMin' | 'amountMax'
> & {
  /** 表格当前页码，从 1 开始。 */
  current?: number;
  /** 表格每页条数。 */
  pageSize?: number;
  /** 结算金额下限，保留合法的 0。 */
  amountMin?: number;
  /** 结算金额上限。 */
  amountMax?: number;
};
