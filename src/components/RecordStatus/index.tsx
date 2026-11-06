import { Tag } from 'antd';

export default function RecordStatus({ value }: { value: string }) {
  const done = /已完成|已授权|已通过|已认证|已归档|已确认到账|已上架/.test(
    value,
  );
  const waiting = /待|审核中/.test(value);
  const stopped = /已取消|已撤回|驳回|停用/.test(value);
  return (
    <Tag
      bordered={false}
      color={
        done ? 'success' : waiting ? 'warning' : stopped ? 'default' : 'purple'
      }
    >
      • {value}
    </Tag>
  );
}
