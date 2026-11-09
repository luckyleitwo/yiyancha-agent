import LayoutIcon from '@/components/AdminLayout/LayoutIcon';
import { RightOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import { message } from 'antd';
import { dashboardTasks } from '../../constants';
import shared from '../../index.less';
import styles from './index.less';

export default function Tasks() {
  return (
    <section className={shared.card} aria-label="待办事项">
      <div className={shared.cardHead}>
        <div>
          <h2>待办事项</h2>
          <p>及时跟进，让业务顺畅推进</p>
        </div>
        <span className={shared.warningBadge}>— 项待办</span>
      </div>
      <div className={styles.list}>
        {dashboardTasks.map((task) => (
          <button
            type="button"
            key={task.section}
            className={styles.task}
            onClick={() =>
              task.section === 'companies'
                ? history.push('/CustomerProducts/Companies')
                : message.info('该功能暂未开放')
            }
          >
            <span className={styles.icon}>
              <LayoutIcon name={task.icon} />
            </span>
            <span className={styles.name}>
              {task.name}
              <small>{task.description}</small>
            </span>
            <b>—</b>
            <RightOutlined className={styles.chevron} />
          </button>
        ))}
      </div>
    </section>
  );
}
