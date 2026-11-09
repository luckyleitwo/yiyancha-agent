import RecordTabs from '@/components/RecordTabs';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer, type ActionType } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Alert, Button, message } from 'antd';
import { useEffect, useRef } from 'react';
import OpeningsTable from './components/OpeningsTable';
import { OPENING_STATUSES } from './constants';
import styles from './index.less';

export default function OpeningsPage() {
  const { status, setStatus, scopeTotal, error, requestOpenings, reset } =
    useModel('agent.Openings.model');
  const [messageApi, contextHolder] = message.useMessage();
  const actionRef = useRef<ActionType>();
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
          <h1>产品开通</h1>
          <p>选择企业与产品，提交开通申请并记录审核结果。</p>
        </div>
        <Button
          type="primary"
          className={styles.addButton}
          icon={<PlusOutlined />}
          onClick={() => showAction('新增')}
        >
          新增开通申请
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
          value={status}
          count={scopeTotal}
          statuses={OPENING_STATUSES}
          onChange={(value) => {
            actionRef.current?.setPageInfo?.({ current: 1 });
            setStatus(value);
          }}
        />
        <OpeningsTable
          actionRef={actionRef}
          status={status}
          requestOpenings={requestOpenings}
          onAction={showAction}
        />
      </div>
    </PageContainer>
  );
}
