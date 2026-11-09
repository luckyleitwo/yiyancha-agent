import PrototypeStatusTag from '@/components/PrototypeStatusTag';
import { dateTime } from '@/utils/businessFormat';
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
  POLICY_STATUS_LABELS,
  POLICY_STATUS_OPTIONS,
} from '../../constants';
import styles from '../../index.less';

type Props = {
  actionRef: MutableRefObject<ActionType | undefined>;
  requestPolicies: (query: YiyanchaAPI.listAgentPoliciesParams) => Promise<{
    data: YiyanchaAPI.AgentPolicy[];
    total: number;
    success: boolean;
  }>;
  onAction: (action: string) => void;
};

export default function PoliciesTable({
  actionRef,
  requestPolicies,
  onAction,
}: Props) {
  const columns: ProColumns<YiyanchaAPI.AgentPolicy>[] = [
    { title: '政策名称', dataIndex: 'name', hideInTable: true },
    { title: '代理名称', dataIndex: 'agentName', hideInTable: true },
    { title: '代理编号', dataIndex: 'agentId', hideInTable: true },
    { title: '产品名称', dataIndex: 'productName', hideInTable: true },
    { title: '产品编号', dataIndex: 'productId', hideInTable: true },
    {
      title: '最低分佣比例（%）',
      dataIndex: 'minCommissionRate',
      hideInTable: true,
      valueType: 'digit',
      fieldProps: { min: 0 },
    },
    {
      title: '最高分佣比例（%）',
      dataIndex: 'maxCommissionRate',
      hideInTable: true,
      valueType: 'digit',
      fieldProps: { min: 0 },
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInTable: true,
      valueType: 'select',
      fieldProps: { options: POLICY_STATUS_OPTIONS, allowClear: true },
    },
    {
      title: '政策名称',
      dataIndex: 'name',
      search: false,
      render: (_, row) => row.name || '—',
    },
    {
      title: '适用代理',
      dataIndex: 'agentName',
      search: false,
      render: (_, row) => row.agentName || '—',
    },
    {
      title: '允许销售产品',
      dataIndex: 'productNames',
      search: false,
      render: (_, row) => row.productNames || '—',
    },
    {
      title: '分佣比例',
      dataIndex: 'commissionRate',
      search: false,
      render: (_, row) =>
        row.commissionRate === null || row.commissionRate === undefined
          ? '—'
          : `${row.commissionRate}%`,
    },
    {
      title: '生效时间',
      dataIndex: 'effectiveFrom',
      search: false,
      render: (_, row) => dateTime(row.effectiveFrom),
    },
    {
      title: '失效时间',
      dataIndex: 'effectiveUntil',
      search: false,
      render: (_, row) => dateTime(row.effectiveUntil),
    },
    {
      title: '状态',
      dataIndex: 'status',
      search: false,
      render: (_, row) => (
        <PrototypeStatusTag
          value={POLICY_STATUS_LABELS[row.status ?? ''] ?? row.status}
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
    <ProTable<YiyanchaAPI.AgentPolicy, YiyanchaAPI.listAgentPoliciesParams>
      className={styles.table}
      rowKey="id"
      actionRef={actionRef}
      columns={columns}
      request={(p) =>
        requestPolicies({
          name: p.name?.trim() || undefined,
          agentName: p.agentName?.trim() || undefined,
          agentId: p.agentId?.trim() || undefined,
          productName: p.productName?.trim() || undefined,
          productId: p.productId?.trim() || undefined,
          minCommissionRate: p.minCommissionRate,
          maxCommissionRate: p.maxCommissionRate,
          status: p.status || undefined,
          page: p.current ?? 1,
          pageSize: p.pageSize ?? PAGE_SIZE,
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
