// 企业行业编码及其中文名称，供表单、列表和导出共用。
export const COMPANY_INDUSTRIES = {
  INTERNET_TECHNOLOGY: '互联网科技',
  HUMAN_RESOURCES: '人力资源',
  FINANCIAL_SERVICES: '金融服务',
  MANUFACTURING: '制造业',
  RETAIL_AND_CONSUMER: '零售与消费',
  OTHER: '其他',
} as const;

// 企业行业编码类型。
export type CompanyIndustry = keyof typeof COMPANY_INDUSTRIES;

// 企业行业下拉选项。
export const COMPANY_INDUSTRY_OPTIONS = Object.entries(COMPANY_INDUSTRIES).map(
  ([value, label]) => ({ value, label }),
);

// 显示行业名称；历史中文值和未知值原样保留。
export function companyIndustryLabel(value?: string): string {
  if (!value) return '';
  return COMPANY_INDUSTRIES[value as CompanyIndustry] ?? value;
}
