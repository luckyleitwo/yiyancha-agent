// 分页汇集代理目录，拒绝缺页和重复页，避免选择器静默遗漏代理。
export async function collectCompanyAgents(
  fetchPage: (page: number) => Promise<YiyanchaAPI.ApiResponseAgentPage>,
): Promise<YiyanchaAPI.Organization[]> {
  // 已加载的代理。
  const agents: YiyanchaAPI.Organization[] = [];
  // 已加载代理的编号。
  const ids = new Set<string>();
  // 当前请求页码。
  let page = 1;
  // 服务端返回的代理总数。
  let total = 0;
  do {
    // 当前代理页的响应。
    const response = await fetchPage(page);
    if (!response.success)
      throw new Error(response.message || '代理列表加载失败。');
    if (
      !response.data ||
      !Array.isArray(response.data.items) ||
      typeof response.data.total !== 'number' ||
      response.data.total < 0 ||
      response.data.items.some((item) => !item.id || !item.name)
    ) {
      throw new Error('代理列表响应不符合约定，请联系管理员。');
    }
    total = response.data.total;
    // 合并前的代理数量，用于检测空页或重复页。
    const previousCount = agents.length;
    for (const item of response.data.items) {
      if (item.id && !ids.has(item.id)) {
        ids.add(item.id);
        agents.push(item);
      }
    }
    if (agents.length === previousCount && agents.length < total)
      throw new Error('代理列表加载不完整，请重试。');
    page += 1;
  } while (agents.length < total);
  return agents;
}
