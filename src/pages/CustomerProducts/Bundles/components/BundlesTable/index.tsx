import { money } from '@/utils/businessFormat';
import { DownloadOutlined } from '@ant-design/icons';
import {
  ProTable,
  type ActionType,
  type ProColumns,
} from '@ant-design/pro-components';
import { Button, Space, Tag } from 'antd';
import type { MutableRefObject } from 'react';
import {
  BUNDLE_STATUS_DEFAULT,
  BUNDLE_STATUS_MAP,
  PAGE_SIZE,
} from '../../constants';
import styles from '../../index.less';
import { formatBundleItems } from '../../utils';

// 组合产品查询表单字段。
interface SearchValues {
  name?: string;
  productId?: string;
  productName?: string;
  usageScene?: string;
  minPrice?: number;
  maxPrice?: number;
  includeDemo?: string;
  status?: string;
}
// 表格请求和操作。
interface Props {
  actionRef: MutableRefObject<ActionType | undefined>;
  status: string;
  requestBundles: (
    query: YiyanchaAPI.listBundlesParams,
  ) => Promise<{ data: YiyanchaAPI.Bundle[]; total: number; success: boolean }>;
  onAction: (action: string) => void;
}

// 服务端筛选与分页的组合产品列表。
export default function BundlesTable({
  actionRef,
  status,
  requestBundles,
  onAction,
}: Props) {
  // 接口筛选项与列表字段。
  const columns: ProColumns<YiyanchaAPI.Bundle>[] = [
    {
      title: '组合名称',
      dataIndex: 'name',
      hideInTable: true,
      fieldProps: { allowClear: true },
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      hideInTable: true,
      fieldProps: { allowClear: true },
    },
    {
      title: '产品编号',
      dataIndex: 'productId',
      hideInTable: true,
      fieldProps: { allowClear: true },
    },
    {
      title: '适用场景',
      dataIndex: 'usageScene',
      hideInTable: true,
      fieldProps: { allowClear: true },
    },
    {
      title: '最低组合价（元）',
      dataIndex: 'minPrice',
      hideInTable: true,
      valueType: 'digit',
      fieldProps: { min: 0 },
    },
    {
      title: '最高组合价（元）',
      dataIndex: 'maxPrice',
      hideInTable: true,
      valueType: 'digit',
      fieldProps: { min: 0 },
    },
    {
      title: '数据范围',
      dataIndex: 'includeDemo',
      hideInTable: true,
      valueType: 'select',
      fieldProps: {
        options: [
          { value: 'true', label: '全部数据（含示例）' },
          { value: 'false', label: '不含示例数据' },
        ],
        allowClear: true,
      },
    },
    {
      title: '组合名称',
      dataIndex: 'name',
      search: false,
      render: (_, row) => row.name || '—',
    },
    {
      title: '包含产品',
      dataIndex: 'items',
      search: false,
      render: (_, row) => formatBundleItems(row.items),
    },
    {
      title: '组合价格（元）',
      dataIndex: 'displayPrice',
      search: false,
      render: (_, row) =>
        row.displayPrice === undefined || row.displayPrice === null
          ? '—'
          : money(row.displayPrice),
    },
    {
      title: '适用场景',
      dataIndex: 'usageScene',
      search: false,
      render: (_, row) => row.usageScene || '—',
    },
    {
      title: '状态',
      dataIndex: 'status',
      search: false,
      render: (_, row) => (
        <Tag
          bordered={false}
          className={styles.statusTag}
          style={{
            color: (
              BUNDLE_STATUS_MAP[row.status ?? ''] ?? BUNDLE_STATUS_DEFAULT
            ).color,
            backgroundColor: (
              BUNDLE_STATUS_MAP[row.status ?? ''] ?? BUNDLE_STATUS_DEFAULT
            ).background,
          }}
        >
          {BUNDLE_STATUS_MAP[row.status ?? '']?.label ?? row.status ?? '—'}
        </Tag>
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
    <ProTable<YiyanchaAPI.Bundle, SearchValues>
      className={styles.table}
      rowKey="id"
      actionRef={actionRef}
      columns={columns}
      params={{ status }}
      request={(params) =>
        requestBundles({
          name: params.name?.trim() || undefined,
          productId: params.productId?.trim() || undefined,
          productName: params.productName?.trim() || undefined,
          usageScene: params.usageScene?.trim() || undefined,
          minPrice: params.minPrice,
          maxPrice: params.maxPrice,
          includeDemo:
            params.includeDemo === undefined
              ? undefined
              : params.includeDemo === 'true',
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
      scroll={{ x: 1100 }}
    />
  );
}
