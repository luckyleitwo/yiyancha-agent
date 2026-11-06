import LayoutIcon, {
  type LayoutIconName,
} from '@/components/AdminLayout/LayoutIcon';
import type { DashboardRecord } from '@/services/adminDashboard/types';
import { dateTime } from '@/utils/businessFormat';
import { RightOutlined } from '@ant-design/icons';
import styles from './index.less';

export default function RelatedRecords({
  title,
  records,
  icon,
  onOpen,
}: {
  title: string;
  records: DashboardRecord[];
  icon: LayoutIconName;
  onOpen: (id: string) => void;
}) {
  return (
    <section className={styles.section} aria-label={title}>
      <h3>{title}</h3>
      {records.length ? (
        records.map((record) => (
          <button
            type="button"
            key={record.id}
            className={styles.record}
            onClick={() => onOpen(record.id)}
          >
            <LayoutIcon name={icon} />
            <span>
              <strong>{record.name}</strong>
              <small>
                {record.status} · {dateTime(record.createdAt)}
              </small>
            </span>
            <RightOutlined aria-hidden="true" />
          </button>
        ))
      ) : (
        <p className={styles.empty}>暂无关联记录</p>
      )}
    </section>
  );
}
