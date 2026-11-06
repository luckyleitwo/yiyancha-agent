import type { ReactNode } from 'react';
import styles from './index.less';

export interface DetailField {
  label: string;
  value: ReactNode;
  full?: boolean;
}
export default function DetailFields({ items }: { items: DetailField[] }) {
  return (
    <dl className={styles.grid}>
      {items.map((item) => (
        <div key={item.label} className={item.full ? styles.full : undefined}>
          <dt>{item.label}</dt>
          <dd>
            {item.value === undefined ||
            item.value === null ||
            item.value === ''
              ? '—'
              : item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
