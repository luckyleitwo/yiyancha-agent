import { RouteContext } from '@ant-design/pro-components';
import { Link } from '@umijs/max';
import { Empty, Input, Modal } from 'antd';
import { useContext, useMemo, useState } from 'react';
import LayoutIcon from '../LayoutIcon';
import styles from './MenuSearch.less';

type MenuItem = NonNullable<
  React.ContextType<typeof RouteContext>['menuData']
>[number];
type PageLink = { path: string; name: string };

function collectPages(items: MenuItem[]): PageLink[] {
  return items.flatMap((item) => {
    if (item.hideInMenu || item.disabled) return [];
    const children = item.children ?? item.routes;
    if (children?.length) return collectPages(children);
    if (item.path && item.name && !item.isUrl) {
      return [{ path: item.path, name: item.name }];
    }
    return [];
  });
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function MenuSearch({ open, onClose }: Props) {
  const { menuData } = useContext(RouteContext);
  const [keyword, setKeyword] = useState('');
  const pages = useMemo(() => collectPages(menuData ?? []), [menuData]);
  const query = keyword.trim().toLowerCase();
  const matches = pages.filter((page) =>
    page.name.toLowerCase().includes(query),
  );

  return (
    <Modal
      title="搜索菜单"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      afterClose={() => setKeyword('')}
    >
      <Input
        autoFocus
        allowClear
        prefix={<LayoutIcon name="search" />}
        placeholder="输入页面名称，例如：企业、订单"
        aria-label="搜索菜单名称"
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
      />
      <div className={styles.searchResults}>
        {matches.length ? (
          <ul>
            {matches.map((page) => (
              <li key={page.path}>
                <Link to={page.path} onClick={onClose}>
                  {page.name}
                  <span>{page.path}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="未找到相关菜单"
          />
        )}
      </div>
    </Modal>
  );
}
