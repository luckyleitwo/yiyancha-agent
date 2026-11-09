import { PlusOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import { Button } from 'antd';
import styles from './index.less';

export default function Welcome() {
  const today = new Date().toLocaleDateString('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
  return (
    <section className={styles.hero} aria-label="欢迎信息">
      <div>
        <h2>欢迎回来，开启高效的一天</h2>
        <p>{today} · 连接客户与可信服务</p>
      </div>
      <Button
        type="primary"
        icon={<PlusOutlined aria-hidden="true" />}
        onClick={() => history.push('/CustomerProducts/Companies')}
      >
        管理企业
      </Button>
      <svg
        className={styles.art}
        viewBox="0 0 250 190"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="145" cy="92" r="72" />
        <circle cx="145" cy="92" r="53" />
        <circle cx="145" cy="92" r="34" />
        <path d="M42 113 145 48l88 48-103 63z" fill="#f7f4ff" />
        <path
          d="M42 113v18l88 48v-20 M130 159l103-63v18l-103 65"
          fill="#e1d6fa"
        />
        <rect
          x="102"
          y="36"
          width="60"
          height="77"
          rx="9"
          fill="#fdfbff"
          transform="rotate(14 102 36)"
        />
        <path d="m114 68 10 10 18-16" strokeWidth="4" />
        <path d="m110 89 29 7 M107 99l21 5" strokeWidth="3" />
        <circle cx="210" cy="44" r="8" fill="#ded3f9" />
        <circle cx="60" cy="65" r="5" fill="#ded3f9" />
      </svg>
    </section>
  );
}
