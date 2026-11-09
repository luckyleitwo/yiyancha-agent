import styles from './Footer.less';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span>© {new Date().getFullYear()} 亿眼查 · 企业核验平台</span>
      <span className={styles.footerStatus}>
        <span className={styles.statusDot} />
        代理工作台
      </span>
    </footer>
  );
}
