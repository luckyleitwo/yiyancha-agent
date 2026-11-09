import PrototypeStatusTag from '@/components/PrototypeStatusTag';
import { dateTime, money } from '@/utils/businessFormat';
import { DownloadOutlined } from '@ant-design/icons';
import {
  ProTable,
  type ActionType,
  type ProColumns,
} from '@ant-design/pro-components';
import { Button, Space } from 'antd';
import type { MutableRefObject } from 'react';
import {
  PAGE_SIZE,
  SETTLEMENT_STATUS_LABELS,
  SETTLEMENT_STATUS_OPTIONS,
} from '../../constants';
import styles from '../../index.less';
import type { SettlementSearchValues } from '../../types';

type Props = {
  actionRef: MutableRefObject<ActionType | undefined>;
  requestSettlements: (query: SettlementSearchValues) => Promise<{
    data: YiyanchaAPI.SettlementHistory[];
    total: number;
    success: boolean;
  }>;
  onAction: (action: string) => void;
};

/** 展示收益明细的筛选表单、分页列表及操作入口。 */
export default function SettlementsTable({
  actionRef,
  requestSettlements,
  onAction,
}: Props) {
  // 页面支持的搜索字段与结算记录展示列。
  const columns: ProColumns<YiyanchaAPI.SettlementHistory>[] = [
    { title: '关键词', dataIndex: 'keyword', hideInTable: true },
    { title: '代理编号', dataIndex: 'agentId', hideInTable: true },
    { title: '代理名称', dataIndex: 'agentName', hideInTable: true },
    {
      title: '最小金额（元）',
      dataIndex: 'amountMin',
      hideInTable: true,
      valueType: 'digit',
      fieldProps: { min: 0 },
    },
    {
      title: '最大金额（元）',
      dataIndex: 'amountMax',
      hideInTable: true,
      valueType: 'digit',
      fieldProps: { min: 0 },
    },
    { title: '结算周期', dataIndex: 'periodLabel', hideInTable: true },
    {
      title: '周期开始日期',
      dataIndex: 'periodStart',
      hideInTable: true,
      valueType: 'date',
    },
    {
      title: '周期结束日期',
      dataIndex: 'periodEnd',
      hideInTable: true,
      valueType: 'date',
    },
    { title: '参考编号', dataIndex: 'reference', hideInTable: true },
    { title: '订单编号', dataIndex: 'orderId', hideInTable: true },
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
      dataIndex: 'status',
      hideInTable: true,
      valueType: 'select',
      fieldProps: { options: SETTLEMENT_STATUS_OPTIONS, allowClear: true },
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
      title: '所属代理',
      dataIndex: 'agentName',
      search: false,
      render: (_, row) => row.agentName || '—',
    },
    {
      title: '结算周期',
      dataIndex: 'periodLabel',
      search: false,
      render: (_, row) => row.periodLabel || '—',
    },
    {
      title: '结算金额（元）',
      dataIndex: 'amount',
      search: false,
      render: (_, row) =>
        row.amount === undefined || row.amount === null
          ? '—'
          : money(row.amount),
    },
    {
      title: '订单 / 凭证编号',
      dataIndex: 'reference',
      search: false,
      render: (_, row) => row.reference || row.orderIds || '—',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      search: false,
      render: (_, row) => dateTime(row.createdAt),
    },
    {
      title: '状态',
      dataIndex: 'status',
      search: false,
      render: (_, row) => (
        <PrototypeStatusTag
          value={SETTLEMENT_STATUS_LABELS[row.status ?? ''] ?? row.status}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      search: false,
      render: () => (
        <Space>
          <Button type="link" onClick={() => onAction('详情')}>
            详情
          </Button>
          <Button type="link" onClick={() => onAction('编辑')}>
            编辑
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <ProTable<YiyanchaAPI.SettlementHistory, SettlementSearchValues>
      className={styles.table}
      rowKey="id"
      actionRef={actionRef}
      columns={columns}
      request={requestSettlements}
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
          onClick={() => onAction('导出')}
        >
          导出
        </Button>,
      ]}
      scroll={{ x: 1100 }}
    />
  );
}
