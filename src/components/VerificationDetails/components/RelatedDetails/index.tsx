import RecordStatus from '@/components/RecordStatus';
import type { DashboardData } from '@/services/adminDashboard/types';
import { dateTime, money } from '@/utils/businessFormat';
import { Button } from 'antd';
import type { DetailEntity, DetailTarget } from '../../types';
import DetailFields, { type DetailField } from '../DetailFields';
import RelatedRecords from '../RelatedRecords';

export default function RelatedDetails({
  entity,
  id,
  data,
  onChange,
}: {
  entity: Exclude<DetailEntity, 'orders'>;
  id: string;
  data: DashboardData;
  onChange: (target: DetailTarget) => void;
}) {
  let fields: DetailField[] = [];
  if (entity === 'companies') {
    const item = data.companies.find((record) => record.id === id);
    if (!item) return null;
    fields = [
      { label: '企业名称', value: item.name },
      { label: '统一社会信用代码', value: item.creditCode },
      { label: '联系人', value: item.contact },
      { label: '联系电话', value: item.phone },
      { label: '所属行业', value: item.industry },
      {
        label: '所属代理',
        value: data.agents.find((agent) => agent.id === item.agentId)?.name,
      },
      { label: '状态', value: <RecordStatus value={item.status} /> },
      { label: '企业地址', value: item.address },
      { label: '备注', value: item.notes, full: true },
    ];
  } else if (entity === 'products') {
    const item = data.products.find((record) => record.id === id);
    if (!item) return null;
    fields = [
      { label: '产品名称', value: item.name },
      { label: '产品编码', value: item.code },
      { label: '产品分类', value: item.category },
      { label: '展示单价（元）', value: money(item.price) },
      { label: '核验内容', value: item.content, full: true },
      { label: '必要资料', value: item.inputs },
      { label: '适用场景', value: item.scene },
      { label: '预计耗时', value: item.duration },
      { label: '状态', value: <RecordStatus value={item.status} /> },
      { label: '备注', value: item.notes, full: true },
    ];
  } else {
    const item = data.authorizations.find((record) => record.id === id);
    if (!item) return null;
    const order = data.orders.find((record) => record.id === item.orderId);
    fields = [
      { label: '授权编号', value: item.name },
      {
        label: '关联订单',
        value: order ? (
          <Button
            type="link"
            onClick={() =>
              onChange({ kind: 'detail', entity: 'orders', id: order.id })
            }
          >
            {order.name}
          </Button>
        ) : (
          '—'
        ),
      },
      { label: '核验对象', value: item.subject },
      { label: '授权用途', value: item.purpose },
      { label: '有效期', value: item.expires },
      { label: '授权状态', value: <RecordStatus value={item.status} /> },
    ];
  }
  const record = data[entity].find((item) => item.id === id);
  return (
    <>
      <DetailFields
        items={[
          ...fields,
          { label: '创建时间', value: dateTime(record?.createdAt) },
          { label: '最后修改', value: dateTime(record?.updatedAt) },
        ]}
      />
      {entity === 'companies' && (
        <RelatedRecords
          title="相关核验订单"
          icon="list"
          records={data.orders.filter((item) => item.companyId === id)}
          onOpen={(orderId) =>
            onChange({ kind: 'detail', entity: 'orders', id: orderId })
          }
        />
      )}
    </>
  );
}
