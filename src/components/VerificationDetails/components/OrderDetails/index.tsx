import RecordStatus from '@/components/RecordStatus';
import type { DashboardResponse, Order } from '@/services/adminDashboard/types';
import { dateTime, money } from '@/utils/businessFormat';
import { Button } from 'antd';
import type { DetailTarget } from '../../types';
import DetailFields from '../DetailFields';
import RelatedRecords from '../RelatedRecords';

export default function OrderDetails({
  order,
  snapshot,
  onChange,
  onReport,
}: {
  order: Order;
  snapshot: DashboardResponse;
  onChange: (target: DetailTarget) => void;
  onReport: (id: string) => void;
}) {
  const { data } = snapshot;
  const company = data.companies.find((item) => item.id === order.companyId);
  const product = data.products.find((item) => item.id === order.productId);
  return (
    <>
      <DetailFields
        items={[
          { label: '订单编号', value: order.name },
          {
            label: '所属企业',
            value: company ? (
              <Button
                type="link"
                onClick={() =>
                  onChange({
                    kind: 'detail',
                    entity: 'companies',
                    id: company.id,
                  })
                }
              >
                {company.name}
              </Button>
            ) : (
              '—'
            ),
          },
          { label: '核验对象', value: order.subject },
          {
            label: '核验产品',
            value: product ? (
              <Button
                type="link"
                onClick={() =>
                  onChange({
                    kind: 'detail',
                    entity: 'products',
                    id: product.id,
                  })
                }
              >
                {product.name}
              </Button>
            ) : (
              '—'
            ),
          },
          { label: '使用场景', value: order.scene },
          { label: '查询用途', value: order.purpose, full: true },
          { label: '订单金额', value: money(order.amount) },
          { label: '订单状态', value: <RecordStatus value={order.status} /> },
          {
            label: '授权状态',
            value: <RecordStatus value={order.authorization} />,
          },
          { label: '联系电话', value: order.phone },
          { label: '备注', value: order.notes, full: true },
          { label: '创建时间', value: dateTime(order.createdAt) },
          { label: '最后修改', value: dateTime(order.updatedAt) },
        ]}
      />
      <RelatedRecords
        title="授权记录"
        icon="shield"
        records={data.authorizations.filter(
          (item) => item.orderId === order.id,
        )}
        onOpen={(id) =>
          onChange({ kind: 'detail', entity: 'authorizations', id })
        }
      />
      <RelatedRecords
        title="相关报告"
        icon="file"
        records={data.reports.filter((item) => item.orderId === order.id)}
        onOpen={onReport}
      />
    </>
  );
}
