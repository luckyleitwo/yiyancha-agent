import { Link } from '@umijs/max';
import styles from './Brand.less';

export default function Brand({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <Link
      to="/admin/dashboard"
      className={styles.brand}
      aria-label="亿眼查首页"
    >
      <img src="/favicon.svg" alt="" width={37} height={37} />
      {!collapsed && (
        <div className={styles.brandName}>
          <strong>亿眼查</strong>
        </div>
      )}
    </Link>
  );
}
