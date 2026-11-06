import type {
  CancellationResult,
  DashboardResponse,
} from '@/services/adminDashboard/types';
import { Button, Drawer, Empty, Space, message } from 'antd';
import { useRef } from 'react';
import CancelConfirmation from './components/CancelConfirmation';
import OperationTimeline from './components/OperationTimeline';
import OrderDetails from './components/OrderDetails';
import RecordHero from './components/RecordHero';
import RelatedDetails from './components/RelatedDetails';
import ReportSelection from './components/ReportSelection';
import styles from './index.less';
import useVerificationDetailsModel from './model';
import type { DetailEntity, DetailTarget } from './types';

export type { DetailTarget } from './types';
export { useVerificationOverlay } from './useOverlay';

const names: Record<DetailEntity, string> = {
  orders: '核验订单',
  companies: '企业',
  products: '产品',
  authorizations: '授权记录',
};
const icons = {
  orders: 'list',
  companies: 'building',
  products: 'box',
  authorizations: 'shield',
} as const;
interface Props {
  target: DetailTarget | null;
  snapshot: DashboardResponse;
  onChange: (target: DetailTarget | null) => void;
  onReport: (id: string) => void;
  onCommitted: (result: CancellationResult) => Promise<boolean>;
  restoreFocus: () => void;
}

export default function VerificationDetails({
  target,
  snapshot,
  onChange,
  onReport,
  onCommitted,
  restoreFocus,
}: Props) {
  const { saving, error, canCancel, confirm, clearError } =
    useVerificationDetailsModel(snapshot, onCommitted);
  const [messageApi, contextHolder] = message.useMessage();
  const latestTarget = useRef(target);
  latestTarget.current = target;
  const detail = target?.kind === 'detail' ? target : null;
  const record = detail
    ? snapshot.data[detail.entity].find((item) => item.id === detail.id)
    : undefined;
  const order =
    detail?.entity === 'orders'
      ? snapshot.data.orders.find((item) => item.id === detail.id)
      : undefined;
  const close = () => {
    if (!saving) onChange(null);
  };
  const openReport = (id: string) => {
    onChange(null);
    onReport(id);
  };
  return (
    <>
      {contextHolder}
      <Drawer
        open={!!detail}
        width="min(620px, 100vw)"
        rootClassName={styles.drawer}
        destroyOnClose
        title={
          <div>
            <strong>{detail ? names[detail.entity] : '记录'}详情</strong>
            <p>完整资料与业务关联</p>
          </div>
        }
        onClose={close}
        afterOpenChange={(open) => {
          if (open) return;
          if (!latestTarget.current) restoreFocus();
          else
            document
              .querySelector<HTMLElement>(
                '.ant-modal-wrap:not([style*="display: none"]) button',
              )
              ?.focus();
        }}
        footer={
          <Space>
            {order?.status === '待授权' && (
              <Button
                danger
                disabled={!canCancel}
                title={
                  !canCancel ? '正式撤回服务尚未接入或当前无权限' : undefined
                }
                onClick={() => {
                  clearError();
                  onChange({ kind: 'cancel', id: order.id });
                }}
              >
                撤回核验申请
              </Button>
            )}
            <Button onClick={close}>关闭</Button>
          </Space>
        }
      >
        {record && detail ? (
          <>
            <RecordHero record={record} icon={icons[detail.entity]} />
            {order ? (
              <OrderDetails
                order={order}
                snapshot={snapshot}
                onChange={onChange}
                onReport={openReport}
              />
            ) : (
              detail.entity !== 'orders' && (
                <RelatedDetails
                  entity={detail.entity}
                  id={detail.id}
                  data={snapshot.data}
                  onChange={onChange}
                />
              )
            )}
            <OperationTimeline record={record} logs={snapshot.logs} />
          </>
        ) : (
          <Empty description="记录已不存在，请刷新" />
        )}
      </Drawer>
      <CancelConfirmation
        open={target?.kind === 'cancel'}
        saving={saving}
        error={error}
        allowed={canCancel}
        className={styles.modal}
        onClose={close}
        afterClose={restoreFocus}
        onConfirm={async () => {
          if (target?.kind !== 'cancel') return;
          const result = await confirm(target.id);
          if (!result) return;
          onChange(null);
          if (result.refreshed) messageApi.success('核验申请已撤回');
          else
            messageApi.warning(
              '核验申请已撤回，但重新加载失败，请点击刷新数据。',
            );
        }}
      />
      <ReportSelection
        open={target?.kind === 'reports'}
        reports={
          target?.kind === 'reports'
            ? snapshot.data.reports.filter((item) => item.orderId === target.id)
            : []
        }
        className={styles.modal}
        onReport={openReport}
        onClose={close}
        afterClose={restoreFocus}
      />
    </>
  );
}
