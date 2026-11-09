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
  OPENING_STATUS_DEFAULT,
  OPENING_STATUS_MAP,
  PAGE_SIZE,
} from '../../constants';
import styles from '../../index.less';

type SearchValues = {
  companyId?: string;
  companyName?: string;
  productId?: string;
  productName?: string;
  usagePurpose?: string;
  createdFrom?: string;
  createdTo?: string;
  status?: string;
};
type Result = { data: YiyanchaAPI.Opening[]; total: number; success: boolean };
type Props = {
  actionRef: MutableRefObject<ActionType | undefined>;
  status: string;
  requestOpenings: (query: YiyanchaAPI.listOpeningsParams) => Promise<Result>;
  onAction: (action: string) => void;
};

// 将日期控件的本地时间转换为接口接收的 ISO 时间。
function toIsoDate(value?: string): string | undefined {
  if (!value) return undefined;
  const date = new Date(value.replace(' ', 'T'));
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export default function OpeningsTable({
  actionRef,
  status,
  requestOpenings,
  onAction,
}: Props) {
  const columns: ProColumns<YiyanchaAPI.Opening>[] = [
    { title: '企业名称', dataIndex: 'companyName', hideInTable: true },
    { title: '企业编号', dataIndex: 'companyId', hideInTable: true },
    { title: '产品名称', dataIndex: 'productName', hideInTable: true },
    { title: '产品编号', dataIndex: 'productId', hideInTable: true },
    { title: '使用用途', dataIndex: 'usagePurpose', hideInTable: true },
    {
      title: '申请开始时间',
      dataIndex: 'createdFrom',
      hideInTable: true,
      valueType: 'dateTime',
    },
    {
      title: '申请结束时间',
      dataIndex: 'createdTo',
      hideInTable: true,
      valueType: 'dateTime',
    },
    {
      title: '申请主体',
      key: 'applicant',
      search: false,
      render: (_, row) =>
        row.companyName || row.agentName || row.applicantId || '—',
    },
    {
      title: '产品',
      dataIndex: 'productName',
      search: false,
      render: (_, row) => row.productName || row.productId || '—',
    },
    {
      title: '使用用途',
      dataIndex: 'usagePurpose',
      search: false,
      render: (_, row) => row.usagePurpose || '—',
    },
    {
      title: '申请时间',
      dataIndex: 'createdAt',
      search: false,
      render: (_, row) => dateTime(row.createdAt),
    },
    {
      title: '审核时间',
      dataIndex: 'reviewedAt',
      search: false,
      render: (_, row) => dateTime(row.reviewedAt),
    },
    {
      title: '状态',
      dataIndex: 'status',
      search: false,
      render: (_, row) => {
        const style =
          OPENING_STATUS_MAP[row.status ?? ''] ?? OPENING_STATUS_DEFAULT;
        return (
          <Tag
            bordered={false}
            className={styles.statusTag}
            style={{ color: style.color, background: style.background }}
          >
            {OPENING_STATUS_MAP[row.status ?? '']?.label ?? (row.status || '—')}
          </Tag>
        );
      },
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
    <ProTable<YiyanchaAPI.Opening, SearchValues>
      className={styles.table}
      rowKey="id"
      actionRef={actionRef}
      columns={columns}
      params={{ status }}
      request={(params) =>
        requestOpenings({
          companyId: params.companyId?.trim() || undefined,
          companyName: params.companyName?.trim() || undefined,
          productId: params.productId?.trim() || undefined,
          productName: params.productName?.trim() || undefined,
          usagePurpose: params.usagePurpose?.trim() || undefined,
          createdFrom: toIsoDate(params.createdFrom),
          createdTo: toIsoDate(params.createdTo),
          status: params.status || undefined,
          page: params.current ?? 1,
          pageSize: params.pageSize ?? PAGE_SIZE,
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
          type="primary"
          icon={<DownloadOutlined />}
          onClick={() => onAction('导出')}
        >
          导出
        </Button>,
      ]}
      scroll={{ x: 1000 }}
    />
  );
}
