import { RouteContext } from '@ant-design/pro-components';
import { Link, history, useModel } from '@umijs/max';
import { Button, Empty, Popconfirm, Popover, Tooltip, message } from 'antd';
import { useContext, useState } from 'react';
import LayoutIcon from '../LayoutIcon';
import MenuSearch from '../MenuSearch';
import styles from './Header.less';
import { useLogout } from './useLogout';

interface Props {
  onMenuClick?: () => void;
  menuOpen?: boolean;
}

export default function Header({ onMenuClick, menuOpen }: Props) {
  const { currentMenu } = useContext(RouteContext);
  const [searchOpen, setSearchOpen] = useState(false);
  const pageName = currentMenu?.name ?? '首页看板';
  const { loading, submitLogout } = useLogout();
  const { initialState, setInitialState } = useModel('@@initialState');
  const user = initialState?.currentUser;
  const userName = user?.displayName || user?.userId || '当前用户';

  const handleLogout = async () => {
    const revoked = await submitLogout();
    if (revoked === undefined) return;
    if (!revoked) {
      message.warning('本地已退出，但服务端会话可能尚未撤销');
    }
    history.replace('/login');
    await setInitialState({ authStatus: 'anonymous' });
  };

  return (
    <header className={styles.header}>
      {onMenuClick && (
        <button
          type="button"
          className={styles.iconButton}
          aria-label={menuOpen ? '关闭导航' : '打开导航'}
          aria-expanded={menuOpen}
          onClick={onMenuClick}
        >
          <LayoutIcon name="menu" />
        </button>
      )}
      <nav className={styles.breadcrumb} aria-label="面包屑">
        <LayoutIcon name="grid" />
        <Link to="/Workspace/Home">工作空间</Link>
        <span>/</span>
        <strong aria-current="page">{pageName}</strong>
      </nav>
      <div className={styles.actions}>
        <div className={styles.portalBadge}>
          <LayoutIcon name="layers" />
          <strong>代理端</strong>
        </div>
        <Tooltip title="搜索菜单">
          <button
            type="button"
            className={styles.iconButton}
            aria-label="搜索菜单"
            onClick={() => setSearchOpen(true)}
          >
            <LayoutIcon name="search" />
          </button>
        </Tooltip>
        <Popover
          title="待办事项"
          trigger="click"
          placement="bottomRight"
          content={
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="待办服务尚未接入"
            />
          }
        >
          <button
            type="button"
            className={styles.iconButton}
            aria-label="待办事项"
          >
            <LayoutIcon name="bell" />
          </button>
        </Popover>
        <Popover
          trigger="click"
          placement="bottomRight"
          content={
            <Popconfirm
              title="确认退出登录？"
              onConfirm={handleLogout}
              okText="退出"
              cancelText="取消"
            >
              <Button type="text" loading={loading}>
                退出登录
              </Button>
            </Popconfirm>
          }
        >
          <button type="button" className={styles.user} aria-label="用户菜单">
            <span className={styles.avatar} aria-hidden="true">
              {userName.slice(0, 1)}
            </span>
            <span>
              {userName}
              <small>{user?.roles?.join('、') || '代理端'}</small>
            </span>
          </button>
        </Popover>
      </div>
      <MenuSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
