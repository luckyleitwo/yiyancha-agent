import PrototypeStatusTag from '@/components/PrototypeStatusTag';
import { dateTime } from '@/utils/businessFormat';
import { ProTable, type ProColumns } from '@ant-design/pro-components';
import { Button, Space } from 'antd';
import {
  CERTIFICATION_STATUS_LABELS,
  CERTIFICATION_STATUS_OPTIONS,
  CertificationStatus,
  PAGE_SIZE,
} from '../../constants';
import styles from '../../index.less';
import type {
  CertificationRow,
  CertificationSearchValues,
  CertificationTableProps,
} from '../../type';

/** 展示本人认证记录和已确认筛选，不承载认证表单或请求参数转换。 */
export default function CertificationTable({
  actionRef,
  requestCertifications,
  onAction,
}: CertificationTableProps) {
  // 搜索只提供正式协议明确支持的完整值和范围筛选。
  const columns: ProColumns<CertificationRow>[] = [
    {
      title: '认证姓名',
      dataIndex: 'applicantName',
      hideInTable: true,
      fieldProps: { placeholder: '请输入完整姓名' },
    },
    {
      title: '手机号',
      dataIndex: 'applicantPhone',
      hideInTable: true,
      fieldProps: { placeholder: '请输入完整手机号', autoComplete: 'off' },
    },
    {
      title: '身份证号',
      dataIndex: 'identity',
      hideInTable: true,
      fieldProps: { placeholder: '请输入完整证件号', autoComplete: 'off' },
    },
    {
      title: '最少材料数量',
      dataIndex: 'minDocuments',
      hideInTable: true,
      valueType: 'digit',
      fieldProps: { min: 0, max: 5, precision: 0 },
    },
    {
      title: '最多材料数量',
      dataIndex: 'maxDocuments',
      hideInTable: true,
      valueType: 'digit',
      fieldProps: { min: 0, max: 5, precision: 0 },
    },
    {
      title: '提交开始时间',
      dataIndex: 'submittedFrom',
      hideInTable: true,
      valueType: 'dateTime',
    },
    {
      title: '提交结束时间',
      dataIndex: 'submittedTo',
      hideInTable: true,
      valueType: 'dateTime',
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInTable: true,
      valueType: 'select',
      fieldProps: { options: CERTIFICATION_STATUS_OPTIONS, allowClear: true },
    },
    {
      title: '认证姓名',
      dataIndex: 'applicantName',
      search: false,
      width: 180,
      render: (_, row) => (
        <>
          {row.applicantName ?? '—'}
          <div className={styles.secondary}>{row.id}</div>
        </>
      ),
    },
    {
      title: '身份证号 / 手机号',
      dataIndex: 'identity',
      search: false,
      width: 220,
      render: (_, row) => (
        <>
          {row.identity ?? '—'}
          <div className={styles.secondary}>{row.applicantPhone ?? '—'}</div>
        </>
      ),
    },
    {
      title: '证件材料',
      dataIndex: 'documentCount',
      search: false,
      width: 100,
      render: (_, row) =>
        row.documentCount === undefined || row.documentCount === null
          ? '—'
          : `${row.documentCount} 份`,
    },
    {
      title: '提交时间',
      dataIndex: 'submittedAt',
      search: false,
      width: 170,
      render: (_, row) =>
        row.submittedAt ? dateTime(row.submittedAt) : '未提交',
    },
    {
      title: '状态',
      dataIndex: 'status',
      search: false,
      width: 130,
      render: (_, row) => (
        <PrototypeStatusTag
          value={CERTIFICATION_STATUS_LABELS[row.status ?? ''] ?? row.status}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      search: false,
      width: 180,
      render: (_, row) => (
        <Space size={0}>
          <Button type="link" onClick={() => onAction('查看详情')}>
            查看详情
          </Button>
          {row.status === CertificationStatus.Draft ? (
            <Button type="link" onClick={() => onAction('继续填写')}>
              继续填写
            </Button>
          ) : row.status === CertificationStatus.Rejected ? (
            <Button type="link" onClick={() => onAction('补充重提')}>
              补充重提
            </Button>
          ) : null}
        </Space>
      ),
    },
  ];
  return (
    <ProTable<CertificationRow, CertificationSearchValues>
      className={styles.table}
      actionRef={actionRef}
      rowKey="id"
      headerTitle="我的认证记录"
      columns={columns}
      request={requestCertifications}
      pagination={{
        defaultPageSize: PAGE_SIZE,
        pageSizeOptions: [20, 50, 100],
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条认证记录`,
      }}
      scroll={{ x: 1050 }}
    />
  );
}
