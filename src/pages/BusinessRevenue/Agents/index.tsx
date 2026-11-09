import { PlusOutlined } from '@ant-design/icons';
import { PageContainer, type ActionType } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, message } from 'antd';
import { useEffect, useRef } from 'react';
import AgentsTable from './components/AgentsTable';
import styles from './index.less';

export default function AgentsPage() {
  const { error, requestAgents, reset } = useModel(
    'BusinessRevenue.Agents.model',
  );
  const [messageApi, contextHolder] = message.useMessage();
  const actionRef = useRef<ActionType>();
  useEffect(() => {
    if (error) messageApi.error(error);
  }, [error, messageApi]);
  // 页面 model 是共享实例，离开时取消请求并清除错误。
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
          <h1>下级代理</h1>
          <p>管理代理资料、合作层级和审核记录。</p>
        </div>
        <Button
          type="primary"
          className={styles.addButton}
          icon={<PlusOutlined />}
          onClick={() => showAction('新增')}
        >
          新增代理
        </Button>
      </div>
      <AgentsTable
        actionRef={actionRef}
        requestAgents={requestAgents}
        onAction={showAction}
      />
    </PageContainer>
  );
}
