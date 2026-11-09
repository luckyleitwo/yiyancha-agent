import PrototypeStatusTag from '@/components/PrototypeStatusTag';
import { dateTime, money } from '@/utils/businessFormat';
import { DownloadOutlined } from '@ant-design/icons';
import {
  ProTable,
  type ActionType,
  type ProColumns,
} from '@ant-design/pro-components';
import { Button, Space, Tag } from 'antd';
import type { MutableRefObject } from 'react';
import { PAGE_SIZE, RECHARGE_STATUSES } from '../../constants';
import styles from '../../index.less';
import type { RechargeSearchValues } from '../../types';

type Props = {
  actionRef: MutableRefObject<ActionType | undefined>;
  requestRecharges: (query: RechargeSearchValues) => Promise<{
    data: YiyanchaAPI.RechargeView[];
    total: number;
    success: boolean;
  }>;
  onAction: (action: string) => void;
};

/** 展示客户充值记录的筛选、分页和操作入口。 */
export default function RechargesTable({
  actionRef,
  requestRecharges,
  onAction,
}: Props) {
  // 搜索字段与充值记录的展示列。
  const columns: ProColumns<YiyanchaAPI.RechargeView>[] = [
    { title: '关键词', dataIndex: 'keyword', hideInTable: true },
    {
      title: '状态',
      dataIndex: 'status',
      hideInTable: true,
      valueType: 'select',
      fieldProps: { options: RECHARGE_STATUSES, allowClear: true },
    },
    { title: '企业名称', dataIndex: 'companyName', hideInTable: true },
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
    { title: '付款方式', dataIndex: 'paymentMethod', hideInTable: true },
    {
      title: '银行流水 / 凭证号',
      dataIndex: 'paymentReference',
      hideInTable: true,
    },
    {
      title: '付款日期起',
      dataIndex: 'paymentDateFrom',
      hideInTable: true,
      valueType: 'date',
    },
    {
      title: '付款日期止',
      dataIndex: 'paymentDateTo',
      hideInTable: true,
      valueType: 'date',
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
      title: '所属企业',
      dataIndex: 'companyName',
      search: false,
      render: (_, row) => (
        <>
          {row.companyName || '—'} {row.isDemo && <Tag>示例</Tag>}
          <div className={styles.date}>{dateTime(row.createdAt)}</div>
        </>
      ),
    },
    {
      title: '充值金额（元）',
      dataIndex: 'amount',
      search: false,
      render: (_, row) =>
        row.amount === null || row.amount === undefined
          ? '—'
          : money(row.amount),
    },
    {
      title: '付款方式',
      dataIndex: 'paymentMethod',
      search: false,
      render: (_, row) => row.paymentMethod || '—',
    },
    {
      title: '银行流水 / 凭证号',
      dataIndex: 'paymentReference',
      search: false,
      render: (_, row) => row.paymentReference || '—',
    },
    {
      title: '付款日期',
      dataIndex: 'paymentDate',
      search: false,
      render: (_, row) => row.paymentDate || '—',
    },
    {
      title: '状态',
      dataIndex: 'status',
      search: false,
      render: (_, row) => (
        <PrototypeStatusTag
          value={
            RECHARGE_STATUSES.find((item) => item.value === row.status)
              ?.label ?? row.status
          }
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
    <ProTable<YiyanchaAPI.RechargeView, RechargeSearchValues>
      className={styles.table}
      rowKey="id"
      actionRef={actionRef}
      columns={columns}
      request={requestRecharges}
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
