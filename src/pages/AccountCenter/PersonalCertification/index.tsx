import { PlusOutlined } from '@ant-design/icons';
import { PageContainer, type ActionType } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button } from 'antd';
import { useEffect, useRef } from 'react';
import CertificationOverview from './components/CertificationOverview';
import CertificationTable from './components/CertificationTable';
import styles from './index.less';

/** 组合个人认证记录列表，办理和详情入口按本轮范围仅提示。 */
export default function PersonalCertificationPage() {
  // 本页查询、操作消息及共享 model 的离页清理动作。
  const { contextHolder, overview, requestCertifications, showAction, reset } =
    useModel('AccountCenter.PersonalCertification.model');
  // ProTable 的分页及刷新操作引用。
  const actionRef = useRef<ActionType>();
  // 由页面拥有请求生命周期，model 挂载本身不触发查询。
  useEffect(() => () => reset(), [reset]);
  return (
    <PageContainer
      title={false}
      breadcrumbRender={false}
      ghost
      className={styles.page}
    >
      {contextHolder}
      <div className={styles.heading}>
        <div>
          <div className={styles.eyebrow}>IDENTITY &amp; QUALIFICATION</div>
          <h1>个人实名认证</h1>
          <p>填写本人身份信息，上传有效证件并提交资料审核。</p>
        </div>
        <Button
          type="primary"
          className={styles.addButton}
          icon={<PlusOutlined />}
          onClick={() => showAction('开始个人认证')}
        >
          开始个人认证
        </Button>
      </div>
      <CertificationOverview overview={overview} />
      <CertificationTable
        actionRef={actionRef}
        requestCertifications={requestCertifications}
        onAction={showAction}
      />
    </PageContainer>
  );
}
