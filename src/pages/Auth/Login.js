import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, Form, Input, Button, Typography, Space, message, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { AuthContext } from '../../context/AuthContext';
import './Auth.css';

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // Load saved credentials from localStorage on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('loginEmail');
    const savedPassword = localStorage.getItem('loginPassword');
    if (savedEmail && savedPassword) {
      form.setFieldsValue({
        email: savedEmail,
        password: savedPassword,
        remember: true,
      });
    }
  }, [form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/public/auth/login', {
        email: values.email,
        password: values.password,
      });
      login(
        response.data.user,
        response.data.accessToken,
        response.data.refreshToken
      );
      
      // Save credentials to localStorage if "Remember Me" is checked
      if (values.remember) {
        localStorage.setItem('loginEmail', values.email);
        localStorage.setItem('loginPassword', values.password);
      } else {
        // Clear saved credentials if "Remember Me" is unchecked
        localStorage.removeItem('loginEmail');
        localStorage.removeItem('loginPassword');
      }

      message.success('Đăng nhập thành công!');
      navigate('/');
    } catch (error) {
      message.error(error.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <Card className="auth-card">
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div className="auth-header">
              <Title level={2}>Đăng nhập</Title>
              <Text type="secondary">Chào mừng bạn quay trở lại!</Text>
            </div>

            <Form
              form={form}
              name="login"
              onFinish={onFinish}
              layout="vertical"
              size="large"
              autoComplete="off"
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="email@example.com"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Mật khẩu"
                />
              </Form.Item>

              <Form.Item name="remember" valuePropName="checked">
                <Checkbox>Ghi nhớ đăng nhập</Checkbox>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<LoginOutlined />}
                  loading={loading}
                  block
                >
                  Đăng nhập
                </Button>
              </Form.Item>
            </Form>

            <div className="auth-footer">
              <Text>
                Chưa có tài khoản?{' '}
                <Link to="/register">
                  <Text strong style={{ color: '#ff6b6b' }}>Đăng ký ngay</Text>
                </Link>
              </Text>
            </div>
          </Space>
        </Card>

        <div className="auth-illustration">
          <Space direction="vertical" size="large" align="center">
            <Title level={1} style={{ color: 'white', margin: 0 }}>
              FoodExpress
            </Title>
            <Text style={{ color: 'white', fontSize: 18, opacity: 0.9 }}>
              Giao hàng nhanh chóng, món ăn ngon
            </Text>
            <div className="illustration-emoji">🍔🍕🍜</div>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default Login;