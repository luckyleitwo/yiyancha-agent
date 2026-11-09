import { PlusOutlined } from '@ant-design/icons';
import { PageContainer, type ActionType } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, message } from 'antd';
import { useEffect, useRef } from 'react';
import SettlementsTable from './components/SettlementsTable';
import styles from './index.less';

/** 展示本人及下属代理的收益明细页面。 */
export default function SettlementsPage() {
  // model 提供的列表错误、查询动作和清理方法。
  const { error, requestSettlements, reset } = useModel(
    'BusinessRevenue.Settlements.model',
  );
  // 页面提示实例及其主题上下文节点。
  const [messageApi, contextHolder] = message.useMessage();
  // 结算列表的刷新和分页操作引用。
  const actionRef = useRef<ActionType>();
  useEffect(() => {
    if (error) messageApi.error(error);
  }, [error, messageApi]);
  // 页面 model 是共享实例，离页时清理状态及请求。
  useEffect(() => () => reset(), [reset]);
  /** 对尚未开放的新增、详情、编辑和导出入口给出提示。 */
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
