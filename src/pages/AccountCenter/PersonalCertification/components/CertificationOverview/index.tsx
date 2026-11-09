import {
  FileTextOutlined,
  RightOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import type { CertificationOverviewProps } from '../../type';
import styles from './index.less';

/** 还原原型的认证介绍、三步流程、本人统计及材料准备说明。 */
export default function CertificationOverview({
  overview,
}: CertificationOverviewProps) {
  return (
    <div className={styles.overview}>
      <section className={styles.intro} aria-label="本人实名资料认证">
        <div className={styles.introTitle}>
          <span className={styles.introIcon} aria-hidden="true">
            <SafetyCertificateOutlined />
          </span>
          <div>
            <h2>本人实名资料认证</h2>
            <p>姓名、身份证信息与证件材料对应核对</p>
          </div>
        </div>
        <ol className={styles.process} aria-label="认证办理流程">
          <li>
            <b>01</b>填写实名信息
            <RightOutlined aria-hidden="true" />
          </li>
          <li>
            <b>02</b>上传有效证件
            <RightOutlined aria-hidden="true" />
          </li>
          <li>
            <b>03</b>提交资料审核
          </li>
        </ol>
        <dl className={styles.statistics} aria-label="本人认证统计">
          <div>
            <dt>认证记录</dt>
            <dd>{overview.total ?? '—'}</dd>
          </div>
          <div>
            <dt>待审核</dt>
            <dd>{overview.pending ?? '—'}</dd>
          </div>
          <div>
            <dt>人工审核通过</dt>
            <dd>{overview.approved ?? '—'}</dd>
          </div>
        </dl>
      </section>
      <aside className={styles.materials} aria-label="认证所需材料">
        <h3>
          <FileTextOutlined aria-hidden="true" />
          准备好以下材料
        </h3>
        <ul>
          <li>本人真实姓名、身份证号、手机号</li>
          <li>身份证人像面与国徽面</li>
          <li>有效期信息及资料提交声明</li>
        </ul>
        <p>图片支持 JPG / PNG，每份不超过 5MB。</p>
      </aside>
    </div>
  );
}
