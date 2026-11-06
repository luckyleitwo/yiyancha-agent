import styles from './LayoutIcon.less';
import type { LayoutIconName } from './paths';
import { paths } from './paths';

interface Props {
  name: LayoutIconName;
  size?: number;
}

export default function LayoutIcon({ name, size = 19 }: Props) {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
    >
      <path d={paths[name]} />
    </svg>
  );
}
