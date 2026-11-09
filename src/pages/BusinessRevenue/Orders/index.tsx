import { PageContainer, type ActionType } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { useEffect, useRef } from 'react';
import OrdersTable from './components/OrdersTable';
import styles from './index.less';

/** 组合客户查询记录页面并直接绑定 model 的业务动作。 */
export default function OrdersPage() {
  // 页面所需的消息上下文、业务状态及操作方法。
  const {
    messageApi,
    contextHolder,
    error,
    exporting,
    requestOrders,
    exportOrders,
    reset,
  } = useModel('BusinessRevenue.Orders.model');
  useEffect(() => {
    if (error) messageApi.error(error);
  }, [error, messageApi]);
  // ProTable 操作引用，供页面控制列表刷新及分页。
  const actionRef = useRef<ActionType>();
  // 页面卸载时取消请求并清理共享 model。
  useEffect(() => () => reset(), [reset]);
  /** 对尚未开放的详情入口给出提示，不发起写请求。 */
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
        exporting={exporting}
        onExport={exportOrders}
        onAction={showAction}
      />
    </PageContainer>
  );
}
