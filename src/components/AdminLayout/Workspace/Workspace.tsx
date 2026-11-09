import LayoutIcon from '../LayoutIcon';
import styles from './Workspace.less';

export default function Workspace({
  collapsed = false,
}: {
  collapsed?: boolean;
}) {
  return (
    <div className={styles.workspace}>
      <span className={styles.workspaceIcon}>
        <LayoutIcon name="layers" />
      </span>
      {!collapsed && (
        <div>
          <strong>代理工作台</strong>
        </div>
      )}
    </div>
  );
}
