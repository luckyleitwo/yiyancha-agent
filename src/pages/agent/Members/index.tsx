import RecordStatus from '@/components/RecordStatus';
import RecordTabs from '@/components/RecordTabs';
import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import {
  ProTable,
  type ActionType,
  type ProColumns,
} from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, Space, message } from 'antd';
import { useEffect, useRef } from 'react';
import { PAGE_SIZE, STATUSES } from './constants';
import styles from './index.less';
import type { Filters } from './types';

type User = YiyanchaAPI.User;

export default function Members() {
  const [messageApi, contextHolder] = message.useMessage();
  const { status, setStatus, scopeTotal, error, requestMembers, reset } =
    useModel('agent.Members.model');
  const actionRef = useRef<ActionType>();
  // 页面卸载时清理共享 model，避免保留上次筛选。
  useEffect(() => () => reset(), [reset]);
  useEffect(() => {
    if (error) messageApi.error(error);
  }, [error, messageApi]);
  const placeholder = () => messageApi.info('该功能暂未开放');
  const columns: ProColumns<User>[] = [
    {
      title: '姓名',
      dataIndex: 'displayName',
      renderText: (value) => value || '—',
    },
    {
      title: '登录账号',
      dataIndex: 'loginName',
      renderText: (value) => value || '—',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      fieldProps: { placeholder: '请输入完整邮箱' },
      renderText: (value) => value || '—',
    },
    {
      title: '所属企业',
      dataIndex: 'companyName',
      renderText: (value) => value || '—',
    },
    { title: '企业编号', dataIndex: 'companyId', hideInTable: true },
    { title: '所属代理', dataIndex: 'agentName', hideInTable: true },
    {
      title: '部门 / 项目',
      dataIndex: 'department',
      renderText: (value) => value || '—',
    },
    { title: '角色编号', dataIndex: 'roleId', hideInTable: true },
    {
      title: '角色',
      dataIndex: 'roleNames',
      search: false,
      render: (_, row) => row.roleNames?.join('、') || '—',
    },
    {
      title: '状态',
      dataIndex: 'status',
      search: false,
      render: (_, row) =>
        row.status ? (
          <RecordStatus value={STATUSES[row.status] ?? row.status} />
        ) : (
          '—'
        ),
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
          <h1>客户账号</h1>
          <p>管理成员资料与角色配置。</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={placeholder}>
          新增成员
        </Button>
      </div>
      <div className={styles.card}>
        <RecordTabs
          value={status}
          count={scopeTotal}
          statuses={Object.entries(STATUSES).map(([value, label]) => ({
            value,
            label,
          }))}
          onChange={(value) => {
            actionRef.current?.setPageInfo?.({ current: 1 });
            setStatus(value);
          }}
        />
        <ProTable<User, Filters>
          actionRef={actionRef}
          params={{ status }}
          headerTitle="客户账号列表"
          rowKey="id"
          columns={columns}
          search={{ labelWidth: 'auto' }}
          pagination={{
            defaultPageSize: PAGE_SIZE,
            showSizeChanger: true,
            pageSizeOptions: [20, 50, 100],
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          scroll={{ x: 1100 }}
          toolBarRender={() => [
            <Button
              key="export"
              icon={<DownloadOutlined />}
              onClick={placeholder}
            >
              导出
            </Button>,
          ]}
          request={requestMembers}
        />
      </div>
    </div>
  );
}
