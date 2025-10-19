import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, Form, Input, Button, Typography, Space, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { AuthContext } from '../../context/AuthContext';
import './Auth.css';

const { Title, Text } = Typography;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const { confirmPassword, ...registerData } = values;
      const response = await axios.post('/api/auth/register', registerData);
      register(
        response.data.user, 
        response.data.accessToken, 
        response.data.refreshToken
      );
      message.success('Đăng ký thành công!');
      navigate('/');
    } catch (error) {
      message.error(error.response?.data?.message || 'Đăng ký thất bại');
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
              <Title level={2}>Đăng ký</Title>
              <Text type="secondary">Tạo tài khoản mới</Text>
            </div>

            <Form
              name="register"
              onFinish={onFinish}
              layout="vertical"
              size="large"
              autoComplete="off"
            >
              <Form.Item
                name="name"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Nguyễn Văn A"
                />
              </Form.Item>

              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="email@example.com"
                />
              </Form.Item>

              <Form.Item name="phone">
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="0123456789"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu!' },
                  { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Mật khẩu"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Mật khẩu không khớp!'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Xác nhận mật khẩu"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                >
                  Đăng ký
                </Button>
              </Form.Item>
            </Form>

            <div className="auth-footer">
              <Text>
                Đã có tài khoản?{' '}
                <Link to="/login">
                  <Text strong style={{ color: '#ff6b6b' }}>Đăng nhập</Text>
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

export default Register;
