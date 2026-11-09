import { PageContainer, type ActionType } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { message } from 'antd';
import { useEffect, useRef } from 'react';
import OrdersTable from './components/OrdersTable';
import styles from './index.less';

export default function OrdersPage() {
  const { error, requestOrders, exportOrders, reset } = useModel(
    'BusinessRevenue.Orders.model',
  );
  const [messageApi, contextHolder] = message.useMessage();
  useEffect(() => {
    if (error) messageApi.error(error);
  }, [error, messageApi]);
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
          <h1>客户查询记录</h1>
          <p>
            查看客户订单是否完成；授权资料及查询结果仅限所属企业和业务中台查看。
          </p>
        </div>
      </div>

      <OrdersTable
        actionRef={actionRef}
        requestOrders={requestOrders}
        exportOrders={exportOrders}
        onAction={showAction}
      />
    </PageContainer>
  );
}
