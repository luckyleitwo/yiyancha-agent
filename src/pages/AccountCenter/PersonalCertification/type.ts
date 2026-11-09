import type { ActionType } from '@ant-design/pro-components';
import type { MutableRefObject } from 'react';

// 表格仅支持个人认证范围内的正式查询字段，不允许选择主体类型。
export type CertificationSearchValues = Omit<
  YiyanchaAPI.certificationsParams,
  'page' | 'size' | 'subjectType'
> & {
  current?: number;
  pageSize?: number;
};

// 列表只保留展示所需字段，证件号及手机号在 model 返回前脱敏。
export type CertificationRow = Pick<
  YiyanchaAPI.Certification,
  | 'id'
  | 'applicantName'
  | 'applicantPhone'
  | 'identity'
  | 'documentCount'
  | 'submittedAt'
  | 'status'
>;

// ProTable 接收的服务端分页结果。
export type CertificationPage = {
  data: CertificationRow[];
  total: number;
  success: boolean;
};

// 本人认证概览，未加载或失败使用空值而非虚构零。
export type CertificationOverview = {
  total?: number;
  pending?: number;
  approved?: number;
};

// 认证介绍区只展示统计值，没有业务操作。
export type CertificationOverviewProps = {
  overview: CertificationOverview;
};

// 列表组件只绑定页面 model 的查询和提示动作。
export type CertificationTableProps = {
  actionRef: MutableRefObject<ActionType | undefined>;
  requestCertifications: (
    values: CertificationSearchValues,
  ) => Promise<CertificationPage>;
  onAction: (action: string) => void;
};
