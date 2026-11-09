import PrototypeStatusTag from '@/components/PrototypeStatusTag';
import { dateTime } from '@/utils/businessFormat';
import { DownloadOutlined } from '@ant-design/icons';
import {
  ProTable,
  type ActionType,
  type ProColumns,
} from '@ant-design/pro-components';
import { Button, Space, Tag } from 'antd';
import type { MutableRefObject } from 'react';
import {
  AGENT_STATUS_LABELS,
  AGENT_STATUS_OPTIONS,
  AGENT_TYPES,
  PAGE_SIZE,
} from '../../constants';
import styles from '../../index.less';

type SearchValues = Omit<YiyanchaAPI.listAgentsParams, 'includeDemo'> & {
  includeDemo?: string;
};
type Props = {
  actionRef: MutableRefObject<ActionType | undefined>;
  requestAgents: (query: YiyanchaAPI.listAgentsParams) => Promise<{
    data: YiyanchaAPI.Organization[];
    total: number;
    success: boolean;
  }>;
  onAction: (action: string) => void;
};

export default function AgentsTable({
  actionRef,
  requestAgents,
  onAction,
}: Props) {
  const columns: ProColumns<YiyanchaAPI.Organization>[] = [
    { title: '代理名称', dataIndex: 'name', hideInTable: true },
    { title: '联系人', dataIndex: 'contactName', hideInTable: true },
    {
      title: '代理类型',
      dataIndex: 'agentType',
      hideInTable: true,
      valueType: 'select',
      fieldProps: { options: AGENT_TYPES, allowClear: true },
    },
    {
      title: '代理层级',
      dataIndex: 'level',
      hideInTable: true,
      valueType: 'digit',
      fieldProps: { min: 1, precision: 0 },
    },
    { title: '上级代理编号', dataIndex: 'parentId', hideInTable: true },
    { title: '上级代理名称', dataIndex: 'parentName', hideInTable: true },
    {
      title: '状态',
      dataIndex: 'status',
      hideInTable: true,
      valueType: 'select',
      fieldProps: { options: AGENT_STATUS_OPTIONS, allowClear: true },
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
      title: '代理名称',
      dataIndex: 'name',
      search: false,
      render: (_, row) => (
        <>
          {row.name || '—'} {row.isDemo && <Tag>示例</Tag>}
          <div className={styles.date}>{dateTime(row.createdAt)}</div>
        </>
      ),
    },
    {
      title: '代理类型',
      dataIndex: 'agentType',
      search: false,
      render: (_, row) =>
        AGENT_TYPES.find((item) => item.value === row.agentType)?.label ??
        row.agentType ??
        '—',
    },
    {
      title: '联系人',
      dataIndex: 'contactName',
      search: false,
      render: (_, row) => row.contactName || '—',
    },
    {
      title: '代理层级',
      dataIndex: 'level',
      search: false,
      render: (_, row) => row.level ?? '—',
    },
    {
      title: '上级代理',
      dataIndex: 'parentName',
      search: false,
      render: (_, row) => row.parentName || '—',
    },
    {
      title: '状态',
      dataIndex: 'status',
      search: false,
      render: (_, row) => (
        <PrototypeStatusTag
          value={AGENT_STATUS_LABELS[row.status ?? ''] ?? row.status}
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
    <ProTable<YiyanchaAPI.Organization, SearchValues>
      className={styles.table}
      rowKey="id"
      actionRef={actionRef}
      columns={columns}
      request={(p) =>
        requestAgents({
          name: p.name?.trim() || undefined,
          contactName: p.contactName?.trim() || undefined,
          agentType: p.agentType || undefined,
          level: p.level,
          parentId: p.parentId?.trim() || undefined,
          parentName: p.parentName?.trim() || undefined,
          status: p.status?.trim() || undefined,
          includeDemo:
            p.includeDemo === undefined ? undefined : p.includeDemo === 'true',
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
