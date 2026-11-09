import { PlusOutlined } from '@ant-design/icons';
import { PageContainer, type ActionType } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button } from 'antd';
import { useEffect, useRef } from 'react';
import WithdrawalsTable from './components/WithdrawalsTable';
import styles from './index.less';

/** 展示提现记录页面，业务查询和反馈统一由 model 管理。 */
export default function WithdrawalsPage() {
  // 当前页面的消息上下文、查询动作和离页清理方法。
  const { contextHolder, requestWithdrawals, showAction, reset } = useModel(
    'BusinessRevenue.Withdrawals.model',
  );
  // 表格操作引用，供 ProTable 管理刷新和分页。
  const actionRef = useRef<ActionType>();
  // 页面是共享 model 的所有者，离页时只取消本页请求。
  useEffect(() => () => reset(), [reset]);
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
          <h1>结算与提现</h1>
          <p>查看本人及下属代理的提现记录。</p>
        </div>
        <Button
          type="primary"
          className={styles.addButton}
          icon={<PlusOutlined />}
          onClick={() => showAction('新增')}
        >
          新增提现申请
        </Button>
      </div>
      <WithdrawalsTable
        actionRef={actionRef}
        requestWithdrawals={requestWithdrawals}
        onAction={showAction}
      />
    </PageContainer>
  );
}
