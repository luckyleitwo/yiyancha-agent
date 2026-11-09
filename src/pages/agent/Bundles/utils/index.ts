// 将接口返回的组合明细用于表格和导出，不额外猜测产品名称。
export function formatBundleItems(items?: YiyanchaAPI.ProductItem[]): string {
  return (
    items
      ?.map((item) => {
        const name = item.name || item.code || item.productId || '—';
        return item.quantity === undefined || item.quantity === null
          ? name
          : `${name} × ${item.quantity}`;
      })
      .join('、') || '—'
  );
}
