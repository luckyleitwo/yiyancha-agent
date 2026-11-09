import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { history, useModel } from '@umijs/max';
import { Button, Form, Input, message } from 'antd';
import styles from './index.less';
import type { LoginValues } from './model';

export default function Login() {
  const [messageApi, contextHolder] = message.useMessage();
  const { loading, submitLogin } = useModel('Login.model');
  const { refresh } = useModel('@@initialState');

  const handleLogin = async (values: LoginValues) => {
    const error = await submitLogin(values);
    if (error) {
      messageApi.error(error);
      return;
    }
    await refresh();
    history.replace('/Workspace/Home');
  };

  return (
    <main className={styles.page}>
      {contextHolder}
      <section className={styles.card} aria-labelledby="login-title">
        <div className={styles.brand}>
          <img src="/favicon.svg" alt="" />
          <span>亿眼查</span>
        </div>
        <h1 id="login-title">欢迎登录</h1>
        <p className={styles.subtitle}>登录亿眼查代理端</p>
        <Form layout="vertical" requiredMark={false} onFinish={handleLogin}>
          <Form.Item
            label="账号"
            name="loginName"
            rules={[{ required: true, message: '请输入账号' }]}
          >
            <Input
              size="large"
              prefix={<UserOutlined />}
              placeholder="请输入账号"
              autoComplete="username"
            />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined />}
              placeholder="请输入密码"
              autoComplete="current-password"
            />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={loading}
            block
          >
            登录
          </Button>
        </Form>
      </section>
    </main>
  );
}
