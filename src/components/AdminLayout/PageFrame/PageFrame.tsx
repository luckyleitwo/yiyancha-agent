import { RouteContext } from '@ant-design/pro-components';
import type { PropsWithChildren } from 'react';
import { useContext } from 'react';
import Header from '../Header';
import styles from './PageFrame.less';

export default function PageFrame({ children }: PropsWithChildren) {
  const { isMobile } = useContext(RouteContext);
  return (
    <>
      {/* ProLayout 的 side 模式在桌面不渲染 Header，顶栏放在内容区顶部。 */}
      {!isMobile && <Header />}
      <div className={styles.pageContent}>{children}</div>
    </>
  );
}
