// 个人认证列表默认每页条数。
export const PAGE_SIZE = 20;

// 正式协议确认的认证状态编码。
export enum CertificationStatus {
  Draft = 'draft',
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
}

// 原型使用的中文状态，未知值由列表保留原文。
export const CERTIFICATION_STATUS_LABELS: Record<string, string> = {
  [CertificationStatus.Draft]: '草稿',
  [CertificationStatus.Pending]: '待审核',
  [CertificationStatus.Approved]: '人工审核通过',
  [CertificationStatus.Rejected]: '已驳回',
};

// 由统一状态映射生成筛选选项。
export const CERTIFICATION_STATUS_OPTIONS = Object.entries(
  CERTIFICATION_STATUS_LABELS,
).map(([value, label]) => ({ value, label }));
