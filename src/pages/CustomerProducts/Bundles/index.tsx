import RecordTabs from '@/components/RecordTabs';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer, type ActionType } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, message } from 'antd';
import { useEffect, useRef } from 'react';
import BundlesTable from './components/BundlesTable';
import { BUNDLE_STATUSES } from './constants';
import styles from './index.less';

export default function BundlesPage() {
  const { status, setStatus, scopeTotal, error, requestBundles, reset } =
    useModel('CustomerProducts.Bundles.model');
  const [messageApi, contextHolder] = message.useMessage();
  useEffect(() => {
    if (error) messageApi.error(error);
  }, [error, messageApi]);
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
          <h1>组合产品</h1>
          <p>按业务场景组合产品并保存标准核验方案。</p>
        </div>
        <Button
          type="primary"
          className={styles.addButton}
          icon={<PlusOutlined />}
          onClick={() => showAction('新增')}
        >
          新增组合产品
        </Button>
      </div>

      <div className={styles.card}>
        <RecordTabs
          value={status}
          count={scopeTotal}
          statuses={BUNDLE_STATUSES}
          onChange={(value) => {
            actionRef.current?.setPageInfo?.({ current: 1 });
            setStatus(value);
          }}
        />
        <BundlesTable
          actionRef={actionRef}
          status={status}
          requestBundles={requestBundles}
          onAction={showAction}
        />
      </div>
    </PageContainer>
  );
}
