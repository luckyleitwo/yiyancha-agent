import {
  createCompany,
  listAgents,
  listCompanies,
} from '@/services/yiyancha/catalog';
import { getAccessToken } from '@/utils/auth';
import { collectCompanyAgents } from './companyAgentPages';

export type CompanyQuery = {
  keyword: string;
  status: string;
  onlyMine: boolean;
  page: number;
  pageSize: number;
};

export async function queryCompanies(
  query: CompanyQuery,
  signal?: AbortSignal,
) {
  const token = getAccessToken();
  if (!token) throw new Error('登录状态已失效，请重新登录。');
  const response = await listCompanies(
    {
      page: query.page,
      pageSize: query.pageSize,
      keyword: query.keyword.trim() || undefined,
      certificationStatus: query.status || undefined,
      onlyMine: query.onlyMine,
      includeDemo: true,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
      signal,
      skipErrorHandler: true,
    },
  );
  if (!response.success)
    throw new Error(response.message || '企业列表加载失败。');
  if (
    !response.data ||
    !Array.isArray(response.data.items) ||
    typeof response.data.total !== 'number' ||
    response.data.items.some((item) => !item.id)
  ) {
    throw new Error('企业列表响应不符合约定，请联系管理员。');
  }
  // 当前范围内不受筛选影响的企业数量。
  const page = response.data;
  return {
    items: response.data.items,
    total: response.data.total,
    scopeTotal: page.scopeTotal,
  };
}

// 加载当前账号可见范围内的全部代理，供新增企业选择。
export async function queryCompanyAgents(signal?: AbortSignal) {
  // 当前登录令牌。
  const token = getAccessToken();
  if (!token) throw new Error('登录状态已失效，请重新登录。');
  return collectCompanyAgents((page) =>
    listAgents(
      { page, pageSize: 100 },
      {
        headers: { Authorization: `Bearer ${token}` },
        signal,
        skipErrorHandler: true,
      },
    ),
  );
}

// 创建企业及其首个门户账号。
export async function createCatalogCompany(
  data: YiyanchaAPI.CompanyCreateRequest,
) {
  // 当前登录令牌。
  const token = getAccessToken();
  if (!token) throw new Error('登录状态已失效，请重新登录。');
  // 企业创建响应。
  const response = await createCompany(data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    skipErrorHandler: true,
  });
  if (!response.success) throw new Error(response.message || '新增企业失败。');
  return response.data;
}
