import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Form, Input, Button, message, Spin } from 'antd';
import './Profile.css';
import axiosInstance from '../../utils/axiosConfig';

const Profile = () => {
  const [form] = Form.useForm();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        // Set initial form values
        form.setFieldsValue({
          phone: parsedUser.phone,
          street: parsedUser.address.street,
          city: parsedUser.address.city,
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
        message.error('Không thể tải thông tin người dùng');
      }
    }
    setLoading(false);
  }, [form]);

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      // Prepare updated user data
      const updatedUser = {
        ...user,
        phone: values.phone,
        address: {
          street: values.street,
          city: values.city,
        },
      };

      // Make API call to update user data
      await axiosInstance.put(`/api/private/users/update/${user.id}`, {
        phone: values.phone,
        address: {
          street: values.street,
          city: values.city,
        },
      });

      // Save updated user data to localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      message.success('Cập nhật thông tin thành công!');
    } catch (error) {
      console.error('Error updating user data:', error);
      message.error('Cập nhật thông tin thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page" style={{ padding: '50px 0', textAlign: 'center' }}>
        <Spin size="large" tip="Đang tải..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page" style={{ padding: '50px 0', textAlign: 'center' }}>
        <p>Không tìm thấy thông tin người dùng</p>
      </div>
    );
  }

  return (
    <div className="profile-page" style={{ padding: '50px 0' }}>
      <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Card title="Hồ sơ người dùng">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              phone: user.phone,
              street: user.address.street,
              city: user.address.city,
            }}
          >
            <Form.Item
              label="Họ và tên"
              style={{ marginBottom: '24px' }}
            >
              <Input value={user.name} disabled />
            </Form.Item>

            <Form.Item
              label="Email"
              style={{ marginBottom: '24px' }}
            >
              <Input value={user.email} disabled />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại' },
                { pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải có 10 chữ số' },
              ]}
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>

            <Form.Item
              label="Đường"
              name="street"
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ đường' }]}
            >
              <Input placeholder="Nhập địa chỉ đường" />
            </Form.Item>

            <Form.Item
              label="Thành phố"
              name="city"
              rules={[{ required: true, message: 'Vui lòng nhập thành phố' }]}
            >
              <Input placeholder="Nhập thành phố" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={submitting} block>
                Cập nhật
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Profile;