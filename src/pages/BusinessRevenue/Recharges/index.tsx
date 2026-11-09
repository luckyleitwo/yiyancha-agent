import { PlusOutlined } from '@ant-design/icons';
import { PageContainer, type ActionType } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, message } from 'antd';
import { useEffect, useRef } from 'react';
import RechargesTable from './components/RechargesTable';
import styles from './index.less';

export default function RechargesPage() {
  const { error, requestRecharges, reset } = useModel(
    'BusinessRevenue.Recharges.model',
  );
  const [messageApi, contextHolder] = message.useMessage();
  useEffect(() => {
    if (error) messageApi.error(error);
  }, [error, messageApi]);
  const actionRef = useRef<ActionType>();
  // 页面 model 为共享实例，离开时清理状态并取消未完成请求。
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
          <h1>客户充值记录</h1>
          <p>登记企业付款及到账审核；本系统不发起真实支付。</p>
        </div>
        <Button
          type="primary"
          className={styles.addButton}
          icon={<PlusOutlined />}
          onClick={() => showAction('新增')}
        >
          新增充值登记
        </Button>
      </div>

      <RechargesTable
        actionRef={actionRef}
        requestRecharges={requestRecharges}
        onAction={showAction}
      />
    </PageContainer>
  );
}
