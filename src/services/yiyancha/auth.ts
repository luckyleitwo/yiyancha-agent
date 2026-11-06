// @ts-ignore
/* eslint-disable */
import { serviceRequest } from '@/services/request';
import { type RequestOptions } from '@umijs/max';
function request<T>(url: string, options?: RequestOptions) {
  return serviceRequest<T>('yiyancha', url, options);
}

/** 登录并创建 Redis 会话 **作用：**校验账号、密码和登录端，成功后在 Redis 创建固定有效期8小时的会话，并在 MySQL 记录登录日志；MySQL 不新增会话行。

**调用时机：**用户在企业端、代理端或中台端提交登录表单时调用；注册不会自动登录。

**调用方式：**向 `POST /api/v1/auth/login` 发送 JSON 请求体，`portal` 使用 `BUSINESS`、`AGENT` 或 `ADMIN`。无需 Bearer 令牌。每个账号15分钟最多尝试5次、每个来源IP最多30次；超限响应体 `code` 为 429，Redis 不可用时为 503，均以 HTTP 200 返回且不会签发会话。成功响应中的 `accessToken` 后续用于 `Authorization: Bearer <令牌>`。密码只通过 HTTPS 传输，并在服务端与 BCrypt 哈希校验。 POST /api/v1/auth/login */
export async function login(
  body: YiyanchaAPI.LoginRequest,
  options?: RequestOptions,
) {
  return request<YiyanchaAPI.ApiResponseLoginResult>('/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 退出当前会话 **作用：**撤销当前 Bearer 会话，并记录退出时间和退出原因。

**调用时机：**用户主动退出、切换账号或应用清理本地会话时调用。

**调用方式：**向 `POST /api/v1/auth/logout` 发送请求，并在 `Authorization` 请求头中携带 `Bearer <登录令牌>`。不需要请求体。 POST /api/v1/auth/logout */
export async function logout(options?: RequestOptions) {
  return request<YiyanchaAPI.ApiResponseVoid>('/api/v1/auth/logout', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 获取当前账号信息 **作用：**返回当前令牌对应账号的基本资料、所属企业或代理编号及角色编码。

**调用时机：**登录成功后初始化用户状态，或页面刷新后恢复当前账号信息时调用。

**调用方式：**向 `GET /api/v1/auth/me` 发送请求，并携带 `Authorization: Bearer <登录令牌>`；账号身份从令牌解析，不能通过请求参数指定其他账号。 GET /api/v1/auth/me */
export async function me(options?: RequestOptions) {
  return request<YiyanchaAPI.ApiResponseCurrentUserResult>('/api/v1/auth/me', {
    method: 'GET',
    ...(options || {}),
  });
}
