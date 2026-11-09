import type { CertificationRow } from '../type';

/** 按原型保留证件号或手机号前 3 后 4 位，短值全部掩码。 */
export function maskPersonalValue(value?: string): string | undefined {
  if (!value) return undefined;
  if (value.length <= 7) return '*'.repeat(value.length);
  return `${value.slice(0, 3)}${'*'.repeat(value.length - 7)}${value.slice(
    -4,
  )}`;
}

/** 转为列表展示数据，不把明文证件及其他详情资料交给表格。 */
export function toCertificationRow(
  item: YiyanchaAPI.Certification,
): CertificationRow {
  return {
    id: item.id,
    applicantName: item.applicantName,
    applicantPhone: maskPersonalValue(item.applicantPhone),
    identity: maskPersonalValue(item.identity),
    documentCount: item.documentCount,
    submittedAt: item.submittedAt,
    status: item.status,
  };
}

/** 将日期时间控件的序列化值转为后端要求的 ISO 本地日期时间。 */
export function toCertificationTime(value?: string): string | undefined {
  return value ? value.replace(' ', 'T') : undefined;
}
