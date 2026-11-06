import type {
  DashboardRecord,
  OperationLog,
} from '@/services/adminDashboard/types';
import { dateTime } from '@/utils/businessFormat';
import styles from './index.less';

export default function OperationTimeline({
  record,
  logs,
}: {
  record: DashboardRecord;
  logs: OperationLog[];
}) {
  return (
    <section className={styles.section} aria-label="操作记录">
      <h3>操作记录</h3>
      <ol className={styles.timeline}>
        <li>
          {record._demo ? '示例数据初始化' : '记录创建'}
          <small>{dateTime(record.createdAt)}</small>
        </li>
        {logs
          .filter((item) => item.record_id === record.id)
          .map((item) => (
            <li key={item.id}>
              {item.action}
              <small>{dateTime(item.created_at)}</small>
            </li>
          ))}
      </ol>
    </section>
  );
}
