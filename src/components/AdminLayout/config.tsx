import type { RunTimeLayoutConfig } from '@umijs/max';
import AuthGuard from './AuthGuard';
import Brand from './Brand';
import Footer from './Footer';
import Header from './Header';
import PageFrame from './PageFrame';
import Workspace from './Workspace';
import styles from './layout.less';
import { renderMenuIcons } from './menuIcons';

export const layout: RunTimeLayoutConfig = () => ({
  title: '亿眼查',
  logo: '/favicon.svg',
  layout: 'side',
  navTheme: 'light',
  siderWidth: 222,
  siderMenuType: 'group',
  fixSiderbar: true,
  fixedHeader: true,
  breakpoint: false,
  defaultCollapsed: false,
  collapsedButtonRender: false,
  className: styles.layout,
  menu: { locale: false },
  menuDataRender: renderMenuIcons,
  menuHeaderRender: (_logo, _title, props) => (
    <Brand collapsed={props?.collapsed} />
  ),
  menuExtraRender: (props) => <Workspace collapsed={props.collapsed} />,
  menuFooterRender: false,
  menuRender: (_props, dom) => <div className={styles.sidebarScope}>{dom}</div>,
  headerRender: (props) => (
    <Header
      onMenuClick={() => props.onCollapse?.(!props.collapsed)}
      menuOpen={!props.collapsed}
    />
  ),
  rightContentRender: false,
  footerRender: () => <Footer />,
  childrenRender: (children) => (
    <AuthGuard>
      <PageFrame>{children}</PageFrame>
    </AuthGuard>
  ),
  contentStyle: { padding: 0, margin: 0, minWidth: 0 },
  token: {
    bgLayout: '#f6f7fb',
    sider: {
      colorMenuBackground: '#fff',
      colorTextMenu: '#747589',
      colorTextMenuSecondary: '#a4a5b6',
      colorTextMenuSelected: '#6954d9',
      colorTextMenuItemHover: '#6954d9',
      colorBgMenuItemSelected: '#f0edff',
      colorBgMenuItemHover: '#f7f5fc',
      colorBgMenuItemActive: '#f0edff',
      colorMenuItemDivider: 'transparent',
      paddingInlineLayoutMenu: 13,
      paddingBlockLayoutMenu: 0,
      menuHeight: 42,
    },
    header: {
      heightLayoutHeader: 72,
      colorBgHeader: '#ffffffed',
    },
    pageContainer: {
      colorBgPageContainer: 'transparent',
      paddingInlinePageContainerContent: 0,
      paddingBlockPageContainerContent: 0,
    },
  },
});
