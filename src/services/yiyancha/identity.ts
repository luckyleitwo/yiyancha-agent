// @ts-ignore
/* eslint-disable */
import { serviceRequest } from '@/services/request';
import { type RequestOptions } from '@umijs/max';
function request<T>(url: string, options?: RequestOptions) {
  return serviceRequest<T>('yiyancha', url, options);
}

/** 分页查询安全审计日志 作用：按来源、动作、资源类型、用户显示名和 ISO 日期时间范围筛选审计记录，不返回审计详情原文；时机：中台或代理安全日志列表加载、筛选或翻页时。用法：GET /api/v1/identity/audit-logs?page=1&pageSize=20&source=&action=&resourceType=&userName=&createdFrom=2026-01-01T00:00:00&createdTo=2026-12-31T23:59:59。代理仅见本代理树及客户操作，依赖写入时归属快照；scopeTotal 不受筛选影响。仅 ADMIN/AGENT 且需 identity:audit:read，每页最多100条。 GET /api/v1/identity/audit-logs */
export async function auditLogs(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: YiyanchaAPI.auditLogsParams,
  options?: RequestOptions,
) {
  return request<YiyanchaAPI.ApiResponsePageAuditLogRecord>(
    '/api/v1/identity/audit-logs',
    {
      method: 'GET',
      params: {
        // page has a default value: 1
        page: '1',
        // pageSize has a default value: 20
        pageSize: '20',
        ...params,
      },
      ...(options || {}),
    },
  );
}

/** 查询权限字典 作用：分页筛选权限名、编码、资源类型和状态；时机：身份管理权限字典加载、筛选或翻页时。用法：GET /api/v1/identity/permissions?name=&code=&type=api&status=active&page=1&pageSize=20。资源类型使用权限数据中实际存储值；状态为 active 或 disabled。scopeTotal 为未筛选权限总数。仅 ADMIN 且需 identity:permission:read，每页最多100条。 GET /api/v1/identity/permissions */
export async function permissions(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: YiyanchaAPI.permissionsParams,
  options?: RequestOptions,
) {
  return request<YiyanchaAPI.ApiResponsePagePermission>(
    '/api/v1/identity/permissions',
    {
      method: 'GET',
      params: {
        // page has a default value: 1
        page: '1',
        // pageSize has a default value: 20
        pageSize: '20',
        ...params,
      },
      ...(options || {}),
    },
  );
}

/** 查询角色目录 作用：分页筛选角色名、编码、状态并返回委派配置；时机：身份管理角色列表加载、筛选或翻页时。用法：GET /api/v1/identity/roles?name=&code=&status=active&page=1&pageSize=20。状态为 active 或 disabled；scopeTotal 为未筛选角色总数。仅 ADMIN 且需 identity:role:read，每页最多100条。 GET /api/v1/identity/roles */
export async function roles(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: YiyanchaAPI.rolesParams,
  options?: RequestOptions,
) {
  return request<YiyanchaAPI.ApiResponsePageRole>('/api/v1/identity/roles', {
    method: 'GET',
    params: {
      // page has a default value: 1
      page: '1',
      // pageSize has a default value: 20
      pageSize: '20',
      ...params,
    },
    ...(options || {}),
  });
}

/** 查询账号 作用：分页查询当前操作者可管理范围内的账号；时机：成员列表加载、筛选或翻页时。用法：GET /api/v1/identity/users?page=1&pageSize=20&portal=BUSINESS&displayName=&loginName=&email=&companyId=&companyName=&agentName=&department=&roleId=&status=active。portal/status 分别为 BUSINESS、AGENT、ADMIN 和 active、disabled；email 盲索引精确匹配。scopeTotal 不受筛选影响；BUSINESS 限本企业，AGENT 限本人代理树及其客户，ADMIN 全局。列表返回邮箱和手机号明文，不返回密文或密码哈希。每页最多100条，需 identity:user:read。 GET /api/v1/identity/users */
export async function users(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: YiyanchaAPI.usersParams,
  options?: RequestOptions,
) {
  return request<YiyanchaAPI.ApiResponsePageUser>('/api/v1/identity/users', {
    method: 'GET',
    params: {
      // page has a default value: 1
      page: '1',
      // pageSize has a default value: 20
      pageSize: '20',
      ...params,
    },
    ...(options || {}),
  });
}
