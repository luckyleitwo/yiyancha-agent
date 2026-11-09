import { PlusOutlined } from '@ant-design/icons';
import { PageContainer, type ActionType } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, message } from 'antd';
import { useEffect, useRef } from 'react';
import SettlementsTable from './components/SettlementsTable';
import styles from './index.less';

export default function SettlementsPage() {
  const { error, requestSettlements, reset } = useModel(
    'BusinessRevenue.Settlements.model',
  );
  const [messageApi, contextHolder] = message.useMessage();
  const actionRef = useRef<ActionType>();
  useEffect(() => {
    if (error) messageApi.error(error);
  }, [error, messageApi]);
  // 页面 model 是共享实例，离页时清理状态及请求。
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
          <h1>收益明细</h1>
          <p>查看本人及下属代理的结算记录。</p>
        </div>
        <Button
          type="primary"
          className={styles.addButton}
          icon={<PlusOutlined />}
          onClick={() => showAction('新增')}
        >
          新增结算单
        </Button>
      </div>
      <SettlementsTable
        actionRef={actionRef}
        requestSettlements={requestSettlements}
        onAction={showAction}
      />
    </PageContainer>
  );
}
