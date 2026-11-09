import { dateTime, money } from '@/utils/businessFormat';
import { DownloadOutlined } from '@ant-design/icons';
import {
  ProTable,
  type ActionType,
  type ProColumns,
} from '@ant-design/pro-components';
import { Button, Tag } from 'antd';
import type { MutableRefObject } from 'react';
import styles from '../../index.less';
import type { OrderQuery } from '../../types';

const PAGE_SIZE = 20;
type SearchValues = Omit<OrderQuery, 'page' | 'size' | 'includeDemo'> & {
  includeDemo?: string;
};
type Props = {
  actionRef: MutableRefObject<ActionType | undefined>;
  requestOrders: (
    query: OrderQuery,
  ) => Promise<{
    data: YiyanchaAPI.OrderView[];
    total: number;
    success: boolean;
  }>;
  onAction: (action: string) => void;
};

// 日期控件采用本地时间，接口接收 ISO 日期时间。
function toIsoDate(value?: string) {
  if (!value) return undefined;
  const date = new Date(value.replace(' ', 'T'));
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export default function OrdersTable({
  actionRef,
  requestOrders,
  onAction,
}: Props) {
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
      title: '订单状态',
      dataIndex: 'status',
      hideInTable: true,
      fieldProps: { placeholder: '请输入状态值' },
    },
    {
      title: '授权状态',
      dataIndex: 'authorizationStatus',
      hideInTable: true,
      fieldProps: { placeholder: '请输入状态值' },
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
      render: (_, row) => (row.amount == null ? '—' : money(row.amount)),
    },
    {
      title: '完成情况',
      dataIndex: 'status',
      search: false,
      render: (_, row) => row.status || '—',
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
    <ProTable<YiyanchaAPI.OrderView, SearchValues>
      className={styles.table}
      rowKey="orderId"
      actionRef={actionRef}
      columns={columns}
      request={(p) =>
        requestOrders({
          orderId: p.orderId?.trim() || undefined,
          batchNo: p.batchNo?.trim() || undefined,
          companyId: p.companyId?.trim() || undefined,
          companyName: p.companyName?.trim() || undefined,
          subjectName: p.subjectName?.trim() || undefined,
          productId: p.productId?.trim() || undefined,
          productName: p.productName?.trim() || undefined,
          agentName: p.agentName?.trim() || undefined,
          minQuantity: p.minQuantity,
          maxQuantity: p.maxQuantity,
          minPaid: p.minPaid,
          maxPaid: p.maxPaid,
          createdFrom: toIsoDate(p.createdFrom),
          createdTo: toIsoDate(p.createdTo),
          status: p.status?.trim() || undefined,
          authorizationStatus: p.authorizationStatus?.trim() || undefined,
          includeDemo:
            p.includeDemo === undefined ? undefined : p.includeDemo === 'true',
          page: p.current ?? 1,
          size: p.pageSize ?? PAGE_SIZE,
        })
      }
      pagination={{
        defaultPageSize: PAGE_SIZE,
        showSizeChanger: true,
        pageSizeOptions: [20, 50, 100],
        showTotal: (total) => `共 ${total} 条记录`,
      }}
      toolBarRender={() => [
        <Button
          key="export"
          icon={<DownloadOutlined />}
          onClick={() => onAction('导出')}
        >
          导出
        </Button>,
      ]}
      scroll={{ x: 1100 }}
    />
  );
}
