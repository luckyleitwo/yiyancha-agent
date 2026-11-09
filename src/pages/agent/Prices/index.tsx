import RecordTabs from '@/components/RecordTabs';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer, type ActionType } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Alert, Button, message } from 'antd';
import { useEffect, useRef } from 'react';
import PricesTable from './components/PricesTable';
import styles from './index.less';

export default function PricesPage() {
  const { scopeTotal, error, requestPrices, reset } =
    useModel('agent.Prices.model');
  const [messageApi, contextHolder] = message.useMessage();
  const actionRef = useRef<ActionType>();
  // 页面卸载时取消请求并清理共享 model。
  useEffect(() => () => reset(), [reset]);
  const showAction = (action: string) =>
    messageApi.info(`${action}功能暂不可用`);
  return (
    <PageContainer
      title={false}
      breadcrumbRender={false}
      ghost
      className={styles.page}
    >
      {contextHolder}
      <div className={styles.heading}>
        <div>
          <h1>销售定价</h1>
          <p>查看代理当前有效的销售价与供货价。</p>
        </div>
        <Button
          type="primary"
          className={styles.addButton}
          icon={<PlusOutlined />}
          onClick={() => showAction('新增')}
        >
          新增定价配置
        </Button>
      </div>
      {error && (
        <Alert
          type="error"
          showIcon
          message={error}
          style={{ marginBottom: 16 }}
          action={
            <Button size="small" onClick={() => actionRef.current?.reload()}>
              重试
            </Button>
          }
        />
      )}
      <div className={styles.card}>
        <RecordTabs
          value=""
          count={scopeTotal}
          statuses={[]}
          onChange={() => {}}
        />
        <PricesTable
          actionRef={actionRef}
          requestPrices={requestPrices}
          onAction={showAction}
        />
      </div>
    </PageContainer>
  );
}
