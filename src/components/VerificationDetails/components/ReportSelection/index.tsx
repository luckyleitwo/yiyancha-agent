import type { Report } from '@/services/adminDashboard/types';
import { Empty, Modal } from 'antd';
import RelatedRecords from '../RelatedRecords';

export default function ReportSelection({
  open,
  reports,
  onReport,
  onClose,
  afterClose,
  className,
}: {
  open: boolean;
  reports: Report[];
  onReport: (id: string) => void;
  onClose: () => void;
  afterClose: () => void;
  className: string;
}) {
  return (
    <Modal
      open={open}
      centered
      title="选择报告"
      footer={null}
      rootClassName={className}
      onCancel={onClose}
      afterClose={afterClose}
      focusTriggerAfterClose={false}
      destroyOnClose
    >
      {reports.length ? (
        <RelatedRecords
          title="关联报告"
          icon="file"
          records={reports}
          onOpen={onReport}
        />
      ) : (
        <Empty description="该订单尚无报告" />
      )}
    </Modal>
  );
}
