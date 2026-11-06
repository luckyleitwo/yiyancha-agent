import type { ProLayoutProps } from '@ant-design/pro-components';
import LayoutIcon, { isLayoutIconName } from './LayoutIcon';

type MenuData = Parameters<NonNullable<ProLayoutProps['menuDataRender']>>[0];

// 菜单数据来自 router.ts，这里只将旧版 SVG 名称适配为 React 图标。
export function renderMenuIcons(items: MenuData): MenuData {
  return items.map((item) => ({
    ...item,
    icon: isLayoutIconName(item.layoutIcon) ? (
      <LayoutIcon name={item.layoutIcon} size={17} />
    ) : (
      item.icon
    ),
    children: item.children ? renderMenuIcons(item.children) : undefined,
  }));
}
