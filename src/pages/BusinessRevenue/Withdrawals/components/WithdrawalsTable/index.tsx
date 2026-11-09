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
  WITHDRAWAL_STATUS_LABELS,
  WITHDRAWAL_STATUS_OPTIONS,
} from '../../constants';
import styles from '../../index.less';
import type { WithdrawalSearchValues } from '../../type';

// 表格仅接收 model 的查询动作和操作提示，不自行转换接口参数。
type Props = {
  actionRef: MutableRefObject<ActionType | undefined>;
  requestWithdrawals: (query: WithdrawalSearchValues) => Promise<{
    data: YiyanchaAPI.WithdrawalView[];
    total: number;
    success: boolean;
  }>;
  onAction: (action: string) => void;
};

/** 渲染提现记录的筛选表单、分页列表及只提示的操作入口。 */
export default function WithdrawalsTable({
  actionRef,
  requestWithdrawals,
  onAction,
}: Props) {
  // 已确认的搜索字段及原型主列表展示列。
  const columns: ProColumns<YiyanchaAPI.WithdrawalView>[] = [
    { title: '代理编号', dataIndex: 'agentId', hideInTable: true },
    { title: '代理名称', dataIndex: 'agentName', hideInTable: true },
    {
      title: '最低金额（元）',
      dataIndex: 'amountMin',
      hideInTable: true,
      valueType: 'digit',
      fieldProps: { min: 0 },
    },
    {
      title: '最高金额（元）',
      dataIndex: 'amountMax',
      hideInTable: true,
      valueType: 'digit',
      fieldProps: { min: 0 },
    },
    {
      title: '收款账户',
      dataIndex: 'bankAccount',
      hideInTable: true,
      fieldProps: { placeholder: '请输入完整收款账户' },
    },
    { title: '打款凭证号', dataIndex: 'payoutReference', hideInTable: true },
    {
      title: '创建开始日期',
      dataIndex: 'createdFrom',
      hideInTable: true,
      valueType: 'date',
    },
    {
      title: '创建结束日期',
      dataIndex: 'createdTo',
      hideInTable: true,
      valueType: 'date',
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInTable: true,
      valueType: 'select',
      fieldProps: { options: WITHDRAWAL_STATUS_OPTIONS, allowClear: true },
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
      title: '代理',
      dataIndex: 'agentName',
      search: false,
      width: 220,
      render: (_, row) => (
        <>
          {row.agentName || row.agentId || '—'}
          <div className={styles.createdAt}>{dateTime(row.createdAt)}</div>
        </>
      ),
    },
    {
      title: '金额（元）',
      dataIndex: 'amount',
      search: false,
      width: 140,
      render: (_, row) =>
        row.amount === undefined || row.amount === null
          ? '—'
          : money(row.amount),
    },
    {
      title: '收款账户',
      dataIndex: 'bankAccount',
      search: false,
      ellipsis: true,
      width: 240,
    },
    {
      title: '打款凭证号',
      dataIndex: 'payoutReference',
      search: false,
      ellipsis: true,
      width: 220,
    },
    {
      title: '状态',
      dataIndex: 'status',
      search: false,
      width: 120,
      render: (_, row) => (
        <PrototypeStatusTag
          value={WITHDRAWAL_STATUS_LABELS[row.status ?? ''] ?? row.status}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      search: false,
      width: 140,
      render: () => (
        <Space size={0}>
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
    <ProTable<YiyanchaAPI.WithdrawalView, WithdrawalSearchValues>
      className={styles.table}
      rowKey="id"
      actionRef={actionRef}
      columns={columns}
      request={requestWithdrawals}
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
