import { PlusOutlined } from '@ant-design/icons';
import { PageContainer, type ActionType } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, message } from 'antd';
import { useEffect, useRef } from 'react';
import PoliciesTable from './components/PoliciesTable';
import styles from './index.less';

export default function PoliciesPage() {
  const { error, requestPolicies, reset } = useModel(
    'BusinessRevenue.Policies.model',
  );
  const [messageApi, contextHolder] = message.useMessage();
  const actionRef = useRef<ActionType>();
  useEffect(() => {
    if (error) messageApi.error(error);
  }, [error, messageApi]);
  // 页面 model 为共享实例，离开时取消请求并清理错误。
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
          <h1>分佣配置</h1>
          <p>配置代理可售范围、分佣比例和政策有效期。</p>
        </div>
        <Button
          type="primary"
          className={styles.addButton}
          icon={<PlusOutlined />}
          onClick={() => showAction('新增')}
        >
          新增代理政策
        </Button>
      </div>
      <PoliciesTable
        actionRef={actionRef}
        requestPolicies={requestPolicies}
        onAction={showAction}
      />
    </PageContainer>
  );
}
