import { ProTable, type ProColumns } from '@ant-design/pro-components';
import { Button, Empty, Space } from 'antd';
import type { Key, ReactNode } from 'react';
import styles from './index.less';

interface Props<T extends object> {
  rows: T[];
  columns: ProColumns<T>[];
  rowKey: keyof T | ((row: T) => Key);
  loading?: boolean;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  onPage: (page: number) => void;
  scrollX?: number;
  emptyText?: ReactNode;
  footer?: ReactNode;
}

export default function RecordTable<T extends object>({
  rows,
  columns,
  rowKey,
  loading,
  total,
  page,
  pageSize,
  totalPages,
  onPage,
  scrollX = 1000,
  emptyText,
  footer,
}: Props<T>) {
  return (
    <>
      <ProTable<T>
        className={styles.table}
        search={false}
        options={false}
        toolBarRender={false}
        ghost
        rowKey={rowKey}
        loading={loading}
        columns={columns}
        dataSource={rows}
        pagination={false}
        scroll={{ x: scrollX }}
        locale={{
          emptyText: <Empty description={emptyText ?? '暂无符合条件的记录'} />,
        }}
      />
      {footer ?? (
        <div className={styles.pagination}>
          <span>
            共 {total} 条记录 · 每页 {pageSize} 条
          </span>
          <Space>
            <Button disabled={page <= 1} onClick={() => onPage(page - 1)}>
              ‹
            </Button>
            <span className={styles.current}>{page}</span>
            <span>/ {totalPages}</span>
            <Button
              disabled={page >= totalPages}
              onClick={() => onPage(page + 1)}
            >
              ›
            </Button>
          </Space>
        </div>
      )}
    </>
  );
}
