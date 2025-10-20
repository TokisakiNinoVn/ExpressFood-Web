import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Popconfirm, message, Space } from 'antd';
import { DeleteOutlined, UserOutlined, CrownOutlined } from '@ant-design/icons';
import axiosInstance from '../../utils/axiosConfig';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/admin/users');
      setUsers(response.data.data);
    } catch (error) {
      message.error('Không thể tải danh sách người dùng');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/users/${id}`);
      message.success('Xóa người dùng thành công');
      fetchUsers();
    } catch (error) {
      message.error('Xóa người dùng thất bại');
    }
  };

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Space>
          {record.role === 'admin' ? <CrownOutlined style={{ color: '#faad14' }} /> : <UserOutlined />}
          {name}
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'SĐT',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      render: (address) => {
        if (!address) return 'Chưa cập nhật';
        return `${address.street}, ${address.city}`;
      },
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'admin' ? 'gold' : 'blue'}>
          {role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Popconfirm
          title="Bạn có chắc muốn xóa người dùng này?"
          onConfirm={() => handleDelete(record._id)}
          okText="Xóa"
          cancelText="Hủy"
          disabled={record.role === 'admin'}
        >
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            size="small"
            disabled={record.role === 'admin'}
          >
            Xóa
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <Table
        dataSource={users}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default UsersManagement;

