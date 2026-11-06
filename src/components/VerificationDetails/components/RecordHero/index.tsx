import LayoutIcon, {
  type LayoutIconName,
} from '@/components/AdminLayout/LayoutIcon';
import RecordStatus from '@/components/RecordStatus';
import type { DashboardRecord } from '@/services/adminDashboard/types';
import { Tag } from 'antd';
import styles from './index.less';

export default function RecordHero({
  record,
  icon,
}: {
  record: DashboardRecord;
  icon: LayoutIconName;
}) {
  return (
    <>
      <div className={styles.hero}>
        <span className={styles.icon}>
          <LayoutIcon name={icon} />
        </span>
        <div>
          <h2>
            {record.name} {record._demo && <Tag>示例记录</Tag>}
          </h2>
          <p>{record.id}</p>
        </div>
      </div>
      <RecordStatus value={record.status} />
    </>
  );
}
