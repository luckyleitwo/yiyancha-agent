import { dateTime, money } from '@/utils/businessFormat';
import { DownloadOutlined } from '@ant-design/icons';
import {
  ProTable,
  type ActionType,
  type ProColumns,
} from '@ant-design/pro-components';
import { Button, Space } from 'antd';
import type { MutableRefObject } from 'react';
import { PAGE_SIZE } from '../../constants';
import styles from '../../index.less';

// 价格查询筛选字段。
interface SearchValues {
  agentId?: string;
  agentName?: string;
  productId?: string;
  productName?: string;
  minSalePrice?: number;
  maxSalePrice?: number;
  minSupplyPrice?: number;
  maxSupplyPrice?: number;
}
// 价格表格请求和操作。
interface Props {
  actionRef: MutableRefObject<ActionType | undefined>;
  requestPrices: (
    query: YiyanchaAPI.listPricesParams,
  ) => Promise<{ data: YiyanchaAPI.Price[]; total: number; success: boolean }>;
  onAction: (action: string) => void;
}

// 当前有效代理价格的服务端筛选表格。
export default function PricesTable({
  actionRef,
  requestPrices,
  onAction,
}: Props) {
  // 查询条件及接口返回字段。
  const columns: ProColumns<YiyanchaAPI.Price>[] = [
    {
      title: '代理名称',
      dataIndex: 'agentName',
      hideInTable: true,
      fieldProps: { allowClear: true },
    },
    {
      title: '代理编号',
      dataIndex: 'agentId',
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
      title: '最低销售价（元）',
      dataIndex: 'minSalePrice',
      hideInTable: true,
      valueType: 'digit',
      fieldProps: { min: 0 },
    },
    {
      title: '最高销售价（元）',
      dataIndex: 'maxSalePrice',
      hideInTable: true,
      valueType: 'digit',
      fieldProps: { min: 0 },
    },
    {
      title: '最低供货价（元）',
      dataIndex: 'minSupplyPrice',
      hideInTable: true,
      valueType: 'digit',
      fieldProps: { min: 0 },
    },
    {
      title: '最高供货价（元）',
      dataIndex: 'maxSupplyPrice',
      hideInTable: true,
      valueType: 'digit',
      fieldProps: { min: 0 },
    },
    {
      title: '代理',
      dataIndex: 'agentName',
      search: false,
      render: (_, row) => row.agentName || '—',
    },
    {
      title: '产品',
      dataIndex: 'productName',
      search: false,
      render: (_, row) => row.productName || '—',
    },
    {
      title: '销售价（元）',
      dataIndex: 'salePrice',
      search: false,
      render: (_, row) =>
        row.salePrice === undefined || row.salePrice === null
          ? '—'
          : money(row.salePrice),
    },
    {
      title: '供货价（元）',
      dataIndex: 'supplyPrice',
      search: false,
      render: (_, row) =>
        row.supplyPrice === undefined || row.supplyPrice === null
          ? '—'
          : money(row.supplyPrice),
    },
    {
      title: '价格版本',
      dataIndex: 'version',
      search: false,
      render: (_, row) => row.version ?? '—',
    },
    {
      title: '生效时间',
      dataIndex: 'effectiveFrom',
      search: false,
      render: (_, row) => dateTime(row.effectiveFrom),
    },
    {
      title: '失效时间',
      dataIndex: 'effectiveTo',
      search: false,
      render: (_, row) => dateTime(row.effectiveTo),
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
    <ProTable<YiyanchaAPI.Price, SearchValues>
      className={styles.table}
      rowKey={(row) => JSON.stringify([row.agentId, row.productId])}
      actionRef={actionRef}
      columns={columns}
      request={(params) =>
        requestPrices({
          agentId: params.agentId?.trim() || undefined,
          agentName: params.agentName?.trim() || undefined,
          productId: params.productId?.trim() || undefined,
          productName: params.productName?.trim() || undefined,
          minSalePrice: params.minSalePrice,
          maxSalePrice: params.maxSalePrice,
          minSupplyPrice: params.minSupplyPrice,
          maxSupplyPrice: params.maxSupplyPrice,
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
