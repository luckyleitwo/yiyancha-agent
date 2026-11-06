import { Alert, Modal } from 'antd';

export default function CancelConfirmation({
  open,
  saving,
  error,
  allowed,
  onConfirm,
  onClose,
  afterClose,
  className,
}: {
  open: boolean;
  saving: boolean;
  error: string;
  allowed: boolean;
  onConfirm: () => void;
  onClose: () => void;
  afterClose: () => void;
  className: string;
}) {
  return (
    <Modal
      open={open}
      centered
      title="撤回核验申请"
      rootClassName={className}
      width={480}
      okText="确认撤回"
      cancelText="取消"
      confirmLoading={saving}
      okButtonProps={{ danger: true, disabled: saving || !allowed }}
      cancelButtonProps={{ disabled: saving }}
      closable={!saving}
      maskClosable={!saving}
      keyboard={!saving}
      focusTriggerAfterClose={false}
      onOk={onConfirm}
      onCancel={onClose}
      afterClose={afterClose}
      destroyOnClose
    >
      <p>撤回后，订单状态将更新为“已取消”，关联授权记录更新为“已撤回”。</p>
      {error && <Alert type="error" showIcon message={error} />}
    </Modal>
  );
}
