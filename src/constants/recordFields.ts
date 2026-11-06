import { COMPANY_INDUSTRY_OPTIONS } from './companyIndustry';

// 企业、代理、充值登记的字段协议；页面表单与 Mock 校验共用，按原型 public/config.js 整理。
export type RecordEntity = 'companies' | 'agents' | 'recharges';
export type RecordFieldType =
  | 'text'
  | 'tel'
  | 'credit'
  | 'select'
  | 'relation'
  | 'textarea'
  | 'number'
  | 'date';

export interface RecordField {
  key: string;
  label: string;
  type: RecordFieldType;
  required?: boolean;
  options?: readonly string[];
  entity?: 'agents' | 'companies';
}

export type RecordValue = string | number;
export type RecordInput = Record<string, RecordValue>;

export interface RecordSchema {
  name: string;
  prefix: string;
  fields: RecordField[];
}

const field = (
  key: string,
  label: string,
  type: RecordFieldType = 'text',
  extra: Partial<RecordField> = {},
): RecordField => ({ key, label, type, ...extra });
const select = (
  key: string,
  label: string,
  options: readonly string[],
  required = false,
) => field(key, label, 'select', { options, required });
const notes = field('notes', '备注', 'textarea');

export const editableEntities: readonly RecordEntity[] = [
  'companies',
  'agents',
  'recharges',
];

export const recordSchemas: Record<RecordEntity, RecordSchema> = {
  companies: {
    name: '企业',
    prefix: 'ENT',
    fields: [
      field('name', '企业名称', 'text', { required: true }),
      field('creditCode', '统一社会信用代码', 'credit'),
      field('contact', '联系人', 'text', { required: true }),
      field('phone', '联系电话', 'tel', { required: true }),
      select(
        'industry',
        '所属行业',
        COMPANY_INDUSTRY_OPTIONS.map((option) => option.label),
      ),
      field('agentId', '所属代理', 'relation', { entity: 'agents' }),
      select(
        'status',
        '状态',
        ['待认证', '审核中', '人工审核通过', '已认证', '已驳回', '已停用'],
        true,
      ),
      field('address', '企业地址'),
      notes,
    ],
  },
  agents: {
    name: '代理',
    prefix: 'AGT',
    fields: [
      field('name', '代理名称', 'text', { required: true }),
      select('type', '代理类型', ['企业代理', '个人代理'], true),
      field('contact', '联系人', 'text', { required: true }),
      field('phone', '联系电话', 'tel', { required: true }),
      select('level', '代理层级', ['一级代理', '二级代理', '三级代理'], true),
      field('parentId', '上级代理', 'relation', { entity: 'agents' }),
      field('bankAccount', '收款账户'),
      select('status', '状态', ['待审核', '已通过', '已驳回', '已停用'], true),
      notes,
    ],
  },
  recharges: {
    name: '充值登记',
    prefix: 'PAY',
    fields: [
      field('companyId', '所属企业', 'relation', {
        entity: 'companies',
        required: true,
      }),
      field('amount', '金额（元）', 'number', { required: true }),
      select('method', '付款方式', ['对公转账', '其他'], true),
      field('reference', '银行流水 / 凭证号', 'text', { required: true }),
      field('paidAt', '付款日期', 'date', { required: true }),
      select('status', '状态', ['待审核', '已确认到账', '已驳回'], true),
      notes,
    ],
  },
};

export const entityNames = {
  orders: '核验订单',
  companies: '企业',
  agents: '代理',
  recharges: '充值登记',
} as const;

export const isEditableEntity = (entity: string): entity is RecordEntity =>
  (editableEntities as readonly string[]).includes(entity);
