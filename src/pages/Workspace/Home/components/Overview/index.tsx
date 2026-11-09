import LayoutIcon, {
  type LayoutIconName,
} from '@/components/AdminLayout/LayoutIcon';
import { RightOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import { message } from 'antd';
import { dashboardShortcuts } from '../../constants';
import styles from './index.less';

export default function Overview({ data }: { data?: YiyanchaAPI.Dashboard }) {
  const metrics: {
    label: string;
    value?: number;
    unit: string;
    icon: LayoutIconName;
    note: string;
  }[] = [
    {
      label: '企业客户',
      value: data?.companyCount,
      unit: '家',
      icon: 'building',
      note: '当前代理范围内企业',
    },
    {
      label: '查询订单',
      value: data?.orderCount,
      unit: '笔',
      icon: 'search',
      note: '当前代理范围内订单',
    },
    {
      label: '代理总量',
      value: data?.agentCount,
      unit: '位',
      icon: 'network',
      note: '当前代理范围内代理',
    },
    { label: '结算登记', unit: '元', icon: 'coins', note: '暂无结算金额汇总' },
  ];
  return (
    <>
      <section className={styles.metrics} aria-label="业务统计">
        {metrics.map((metric) => (
          <article key={metric.label} className={styles.metric}>
            <div className={styles.label}>
              {metric.label}
              <span className={styles.icon}>
                <LayoutIcon name={metric.icon} />
              </span>
            </div>
            <div className={styles.value}>
              {metric.value?.toLocaleString('zh-CN') ?? '—'}
              <small>{metric.unit}</small>
            </div>
            <div className={styles.note}>
              <span>{metric.note}</span>
            </div>
          </article>
        ))}
      </section>
      <nav className={styles.shortcuts} aria-label="快捷入口">
        {dashboardShortcuts.map((item) => (
          <a
            key={item.section}
            href={
              item.section === 'companies'
                ? '/CustomerProducts/Companies'
                : item.section === 'products'
                ? '/CustomerProducts/Catalog'
                : '#'
            }
            onClick={(event) => {
              event.preventDefault();
              if (item.section === 'companies')
                history.push('/CustomerProducts/Companies');
              else if (item.section === 'products')
                history.push('/CustomerProducts/Catalog');
              else message.info('该功能暂未开放');
            }}
          >
            <span className={styles.shortcutIcon}>
              <LayoutIcon name={item.icon} />
            </span>
            <span>
              <strong>{item.name}</strong>
              <small>{item.description}</small>
            </span>
            <RightOutlined />
          </a>
        ))}
      </nav>
    </>
  );
}
