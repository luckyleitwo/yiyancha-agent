import { Tabs } from 'antd';
import styles from './index.less';

export default function StatusTabs({
  value,
  count,
  statuses,
  onChange,
}: {
  value: string;
  count?: number;
  statuses: (string | { value: string; label: string })[];
  onChange: (value: string) => void;
}) {
  return (
    <Tabs
      className={styles.tabs}
      activeKey={value}
      onChange={onChange}
      items={[
        {
          key: '',
          label: (
            <>
              全部记录{' '}
              {count !== undefined && (
                <span className={styles.count}>{count}</span>
              )}
            </>
          ),
        },
        ...statuses.map((status) =>
          typeof status === 'string'
            ? { key: status, label: status }
            : { key: status.value, label: status.label },
        ),
      ]}
    />
  );
}
