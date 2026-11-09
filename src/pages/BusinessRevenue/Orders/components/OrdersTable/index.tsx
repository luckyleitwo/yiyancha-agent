import PrototypeStatusTag from '@/components/PrototypeStatusTag';
import { dateTime, money } from '@/utils/businessFormat';
import { DownloadOutlined } from '@ant-design/icons';
import {
  ProTable,
  type ActionType,
  type ProColumns,
} from '@ant-design/pro-components';
import { Button, Tag } from 'antd';
import type { MutableRefObject } from 'react';
import {
  AUTHORIZATION_STATUS_LABELS,
  AUTHORIZATION_STATUS_OPTIONS,
  PAGE_SIZE,
} from '../../constants';
import styles from '../../index.less';
import type { OrderSearchValues } from '../../types';

type Props = {
  actionRef: MutableRefObject<ActionType | undefined>;
  requestOrders: (query: OrderSearchValues) => Promise<{
    data: YiyanchaAPI.OrderView[];
    total: number;
    success: boolean;
  }>;
  exporting: boolean;
  onExport: () => Promise<void>;
  onAction: (action: string) => void;
};

/** 展示客户查询记录的筛选、分页及导出和详情入口。 */
export default function OrdersTable({
  actionRef,
  requestOrders,
  exporting,
  onExport,
  onAction,
}: Props) {
  // 页面支持的搜索字段和客户查询记录展示列。
  const columns: ProColumns<YiyanchaAPI.OrderView>[] = [
    { title: '订单编号', dataIndex: 'orderId', hideInTable: true },
    { title: '批次号', dataIndex: 'batchNo', hideInTable: true },
    { title: '企业编号', dataIndex: 'companyId', hideInTable: true },
    { title: '企业名称', dataIndex: 'companyName', hideInTable: true },
    { title: '核验对象', dataIndex: 'subjectName', hideInTable: true },
    { title: '产品编号', dataIndex: 'productId', hideInTable: true },
    { title: '产品名称', dataIndex: 'productName', hideInTable: true },
    { title: '代理名称', dataIndex: 'agentName', hideInTable: true },
    {
      title: '最小数量',
      dataIndex: 'minQuantity',
      hideInTable: true,
      valueType: 'digit',
      fieldProps: { min: 0, precision: 0 },
    },
    {
      title: '最大数量',
      dataIndex: 'maxQuantity',
      hideInTable: true,
      valueType: 'digit',
      fieldProps: { min: 0, precision: 0 },
    },
    {
      title: '最低实付金额（元）',
      dataIndex: 'minPaid',
      hideInTable: true,
      valueType: 'digit',
      fieldProps: { min: 0 },
    },
    {
      title: '最高实付金额（元）',
      dataIndex: 'maxPaid',
      hideInTable: true,
      valueType: 'digit',
      fieldProps: { min: 0 },
    },
    {
      title: '创建开始时间',
      dataIndex: 'createdFrom',
      hideInTable: true,
      valueType: 'dateTime',
    },
    {
      title: '创建结束时间',
      dataIndex: 'createdTo',
      hideInTable: true,
      valueType: 'dateTime',
    },
    {
      title: '状态',
      dataIndex: 'authorizationStatus',
      hideInTable: true,
      valueType: 'select',
      fieldProps: { options: AUTHORIZATION_STATUS_OPTIONS, allowClear: true },
    },
    {
      title: '数据范围',
      dataIndex: 'includeDemo',
      hideInTable: true,
      valueType: 'select',
      fieldProps: {
        allowClear: true,
        options: [
          { value: 'true', label: '全部数据（含示例）' },
          { value: 'false', label: '不含示例数据' },
        ],
      },
    },
    {
      title: '订单编号',
      dataIndex: 'orderId',
      search: false,
      render: (_, row) => (
        <>
          {row.orderId || '—'} {row.isDemo && <Tag>示例</Tag>}
        </>
      ),
    },
    {
      title: '核验对象',
      dataIndex: 'subjectName',
      search: false,
      render: (_, row) => row.subjectName || '—',
    },
    {
      title: '所属企业',
      dataIndex: 'companyName',
      search: false,
      render: (_, row) => row.companyName || '—',
    },
    {
      title: '核验产品',
      dataIndex: 'productName',
      search: false,
      render: (_, row) => row.productName || '—',
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      search: false,
      render: (_, row) => row.quantity ?? '—',
    },
    {
      title: '订单金额（元）',
      dataIndex: 'amount',
      search: false,
      render: (_, row) =>
        row.amount === null || row.amount === undefined
          ? '—'
          : money(row.amount),
    },
    {
      title: '完成情况',
      dataIndex: 'authorizationStatus',
      search: false,
      render: (_, row) => (
        <PrototypeStatusTag
          value={
            AUTHORIZATION_STATUS_LABELS[row.authorizationStatus ?? ''] ??
            row.authorizationStatus
          }
        />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      search: false,
      render: (_, row) => dateTime(row.createdAt),
    },
    {
      title: '操作',
      key: 'action',
      search: false,
      render: () => (
        <Button type="link" onClick={() => onAction('详情')}>
          详情
        </Button>
      ),
    },
  ];
  return (
    <ProTable<YiyanchaAPI.OrderView, OrderSearchValues>
      className={styles.table}
      rowKey="orderId"
      actionRef={actionRef}
      columns={columns}
      request={requestOrders}
      pagination={{
        defaultPageSize: PAGE_SIZE,
        showSizeChanger: true,
        pageSizeOptions: [20, 50, 100],
        showTotal: (total) => `共 ${total} 条记录`,
      }}
      toolBarRender={() => [
        <Button
          key="export"
          type="primary"
          icon={<DownloadOutlined />}
          loading={exporting}
          onClick={onExport}
        >
          导出
        </Button>,
      ]}
      scroll={{ x: 1100 }}
    />
  );
}
