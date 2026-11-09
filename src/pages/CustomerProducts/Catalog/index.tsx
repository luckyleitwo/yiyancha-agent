import LayoutIcon, {
  type LayoutIconName,
} from '@/components/AdminLayout/LayoutIcon';
import {
  ArrowRightOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Button, Empty, Pagination, Spin, Tag, message } from 'antd';
import { useEffect } from 'react';
import { PAGE_SIZE } from './constants';
import styles from './index.less';
const icons: LayoutIconName[] = ['shield', 'file', 'building', 'users'];

export default function Catalog() {
  const [messageApi, contextHolder] = message.useMessage();
  const { rows, page, total, loading, error, setPage, load, reset } = useModel(
    'CustomerProducts.Catalog.model',
  );
  useEffect(() => {
    if (error) messageApi.error(error);
  }, [error, messageApi]);
  // 按当前页加载卡片，离开时清理共享 model 的状态。
  useEffect(() => {
    void load(page);
  }, [load, page]);
  useEffect(() => () => reset(), [reset]);

  const placeholder = () => messageApi.info('该功能暂未开放');
  return (
    <div className={styles.page}>
      {contextHolder}
      <div className={styles.heading}>
        <div>
          <h1>产品展示</h1>
          <p>按场景选择合适的核验服务，价格与所需资料一目了然。</p>
        </div>
        <Button onClick={placeholder}>
          <LayoutIcon name="layers" size={16} />
          查看组合方案
        </Button>
      </div>
      <div className={styles.notice}>
        <SafetyOutlined />
        <span>当前展示价格来自产品配置，订单报价以有效价格配置为准。</span>
      </div>

      <Spin spinning={loading}>
        {rows.length > 0 ? (
          <div className={styles.grid}>
            {rows.map((product, index) => (
              <article className={styles.product} key={product.id}>
                <div className={styles.productTop}>
                  <div className={styles.productIcon}>
                    <LayoutIcon name={icons[index % icons.length]} size={23} />
                  </div>
                  <div>
                    <h2>{product.name || '—'}</h2>
                    <div className={styles.category}>
                      {product.category || '—'}{' '}
                      {product.isDemo && <Tag>示例</Tag>}
                    </div>
                  </div>
                </div>
                <p className={styles.content}>{product.content || '—'}</p>
                <div className={styles.details}>
                  <ClockCircleOutlined />
                  {product.duration || '以供应商为准'}
                </div>
                <div className={styles.details}>
                  <FileTextOutlined />
                  所需资料：{product.requiredInputs || '—'}
                </div>
                <div className={styles.bottom}>
                  <div className={styles.price}>
                    {product.displayPrice == null
                      ? '—'
                      : `¥${product.displayPrice.toLocaleString('zh-CN', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`}
                    <small> / 次</small>
                  </div>
                  <Button type="primary" onClick={placeholder}>
                    申请开通 <ArrowRightOutlined />
                  </Button>
                </div>
                <Button
                  type="link"
                  className={styles.detailButton}
                  onClick={placeholder}
                >
                  产品详情
                </Button>
              </article>
            ))}
          </div>
        ) : !loading && !error ? (
          <Empty description="暂无上架产品" />
        ) : null}
      </Spin>
      <div className={styles.pagination}>
        <Pagination
          current={page}
          pageSize={PAGE_SIZE}
          total={total}
          showSizeChanger={false}
          showTotal={(count) => `共 ${count} 条记录`}
          onChange={setPage}
        />
      </div>
    </div>
  );
}
