import { ReloadOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Alert, Button, Empty, Segmented } from 'antd';
import { useEffect } from 'react';
import Overview from './components/Overview';
import Tasks from './components/Tasks';
import Welcome from './components/Welcome';
import styles from './index.less';

export default function HomePage() {
  const { data, loading, error, load, reset } = useModel('agent.Home.model');
  // 进入看板时加载数据，离开后重置共享 model。
  useEffect(() => {
    void load();
    return reset;
  }, [load, reset]);
  return (
    <PageContainer
      ghost
      title={false}
      breadcrumbRender={false}
      className={styles.page}
    >
      <div className={styles.heading}>
        <div>
          <h1>代理工作台</h1>
          <p>一站式管理核验业务，重要信息尽在掌握。</p>
        </div>
        <Button
          icon={<ReloadOutlined />}
          loading={loading}
          onClick={() => void load()}
        >
          刷新数据
        </Button>
      </div>
      {error && (
        <Alert
          className={styles.error}
          type="error"
          showIcon
          message="首页统计获取失败，请检查网络或权限后重试"
          action={
            <Button size="small" onClick={() => void load()}>
              重试
            </Button>
          }
        />
      )}
      <Welcome />
      <Overview data={data} />
      <div className={styles.mainGrid}>
        <section className={styles.card} aria-label="业务趋势">
          <div className={styles.cardHead}>
            <div>
              <h2>业务趋势</h2>
              <p>核验申请量 · 根据当前记录统计</p>
            </div>
            <Segmented disabled size="small" options={['近7天', '近30天']} />
          </div>
          <div
            style={{ minHeight: 250, display: 'grid', placeItems: 'center' }}
          >
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="暂无可用的趋势统计数据"
            />
          </div>
        </section>
        <Tasks />
      </div>
    </PageContainer>
  );
}
