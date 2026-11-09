import { Tag } from 'antd';
import styles from './index.less';

// 与原型的状态标签规则一致；未知值保留原文并使用默认颜色。
export default function PrototypeStatusTag({ value }: { value?: string }) {
  if (!value) return <>—</>;
  const color =
    /已认证|已通过|人工审核通过|已归档|已上架|已完成|已授权|已解决|启用|生效中|合作中|已开通|已签署|已确认到账|已开票|已结算|已打款/.test(
      value,
    )
      ? styles.green
      : /待|审核中|未完成/.test(value)
      ? styles.orange
      : /驳回|紧急|异常/.test(value)
      ? styles.red
      : /停用|关闭|取消|撤回|失效|到期|终止/.test(value)
      ? styles.gray
      : styles.default;
  return (
    <Tag bordered={false} className={`${styles.tag} ${color}`}>
      {value}
    </Tag>
  );
}
