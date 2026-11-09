import RecordStatus from '@/components/RecordStatus';
import RecordTabs from '@/components/RecordTabs';
import {
  COMPANY_INDUSTRY_OPTIONS,
  companyIndustryLabel,
} from '@/constants/companyIndustry';
import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import {
  ProTable,
  type ActionType,
  type ProColumns,
} from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, Space, Tag, message } from 'antd';
import { useEffect, useRef } from 'react';
import { CERTIFICATION_STATUSES, PAGE_SIZE } from './constants';
import styles from './index.less';
import type { Filters } from './types';

type Company = YiyanchaAPI.Organization;

export default function Companies() {
  const [messageApi, contextHolder] = message.useMessage();
  const { status, setStatus, scopeTotal, error, requestCompanies, reset } =
    useModel('agent.Companies.model');
  const actionRef = useRef<ActionType>();
  // 页面卸载时清理共享 model，避免保留上次筛选。
  useEffect(() => () => reset(), [reset]);
  useEffect(() => {
    if (error) messageApi.error(error);
  }, [error, messageApi]);
  const placeholder = () => messageApi.info('该功能暂未开放');
  const columns: ProColumns<Company>[] = [
    {
      title: '关键词',
      dataIndex: 'keyword',
      hideInTable: true,
      fieldProps: { placeholder: '企业名称、联系人或关联信息' },
    },
    {
      title: '企业名称',
      dataIndex: 'name',
      render: (_, row) => (
        <>
          {row.name || '—'} {row.isDemo && <Tag>示例</Tag>}
          {row.createdAt && (
            <small className={styles.createdAt}>{row.createdAt}</small>
          )}
        </>
      ),
    },
    {
      title: '联系人',
      dataIndex: 'contactName',
      renderText: (value) => value || '—',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      fieldProps: { placeholder: '请输入完整手机号' },
      renderText: (value) => value || '—',
    },
    {
      title: '所属行业',
      dataIndex: 'industry',
      valueType: 'select',
      fieldProps: { options: COMPANY_INDUSTRY_OPTIONS },
      render: (_, row) => companyIndustryLabel(row.industry) || '—',
    },
    { title: '代理编号', dataIndex: 'agentId', hideInTable: true },
    {
      title: '所属代理',
      dataIndex: 'agentName',
      search: false,
      renderText: (value) => value || '—',
    },
    {
      title: '认证状态',
      dataIndex: 'certificationStatus',
      search: false,
      render: (_, row) =>
        row.certificationStatus ? (
          <RecordStatus
            value={
              CERTIFICATION_STATUSES[row.certificationStatus] ??
              row.certificationStatus
            }
          />
        ) : (
          '—'
        ),
    },
    {
      title: '示例数据',
      dataIndex: 'includeDemo',
      hideInTable: true,
      valueType: 'select',
      initialValue: 'true',
      fieldProps: {
        options: [
          { label: '全部数据（含示例）', value: 'true' },
          { label: '不含示例数据', value: 'false' },
        ],
      },
    },
    {
      title: '创建范围',
      dataIndex: 'onlyMine',
      hideInTable: true,
      valueType: 'select',
      fieldProps: {
        options: [
          { label: '全部', value: 'false' },
          { label: '仅我创建', value: 'true' },
        ],
      },
    },
    {
      title: '操作',
      key: 'actions',
      search: false,
      render: () => (
        <Space>
          <Button type="link" onClick={placeholder}>
            详情
          </Button>
          <Button type="link" onClick={placeholder}>
            编辑
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <div className={styles.page}>
      {contextHolder}
      <div className={styles.heading}>
        <div>
          <h1>企业客户</h1>
          <p>集中管理企业资料、联系人与认证进度。</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={placeholder}>
          新增企业
        </Button>
      </div>
      <div className={styles.card}>
        <RecordTabs
          value={status}
          count={scopeTotal}
          statuses={Object.entries(CERTIFICATION_STATUSES).map(
            ([value, label]) => ({ value, label }),
          )}
          onChange={(value) => {
            actionRef.current?.setPageInfo?.({ current: 1 });
            setStatus(value);
          }}
        />
        <ProTable<Company, Filters>
          actionRef={actionRef}
          params={{ certificationStatus: status }}
          headerTitle="企业客户列表"
          rowKey="id"
          columns={columns}
          search={{ labelWidth: 'auto' }}
          pagination={{
            defaultPageSize: PAGE_SIZE,
            showSizeChanger: true,
            pageSizeOptions: [20, 50, 100],
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          scroll={{ x: 1000 }}
          toolBarRender={() => [
            <Button
              key="export"
              icon={<DownloadOutlined />}
              onClick={placeholder}
            >
              导出
            </Button>,
          ]}
          request={requestCompanies}
        />
      </div>
    </div>
  );
}
