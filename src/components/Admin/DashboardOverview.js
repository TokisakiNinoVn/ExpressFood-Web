import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Tag } from 'antd';
import {
  ShoppingCartOutlined,
  DollarOutlined,
  UserOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import axiosInstance from '../../utils/axiosConfig';

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalFoods: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [ordersRes, usersRes, foodsRes] = await Promise.all([
        axiosInstance.get('/api/orders'),
        axiosInstance.get('/api/users'),
        axiosInstance.get('/api/foods'),
      ]);

      const orders = ordersRes.data.data || [];
      const users = usersRes.data.data || [];
      const foods = foodsRes.data.data || [];

      const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

      setStats({
        totalOrders: orders.length,
        totalRevenue: totalRevenue,
        totalUsers: users.length,
        totalFoods: foods.length,
      });

      setRecentOrders(orders.slice(0, 5));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'gold',
      confirmed: 'cyan',
      preparing: 'orange',
      delivering: 'blue',
      delivered: 'green',
      cancelled: 'red',
    };
    return colors[status] || 'default';
  };

  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: '_id',
      key: '_id',
      render: (id) => `#${id?.slice(-6)}`,
    },
    {
      title: 'Khách hàng',
      dataIndex: 'user',
      key: 'user',
      render: (user) => user?.name || 'N/A',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => `${amount?.toLocaleString('vi-VN')} ₫`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
  ];

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng đơn hàng"
              value={stats.totalOrders}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Doanh thu"
              value={stats.totalRevenue}
              prefix={<DollarOutlined />}
              suffix="₫"
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Người dùng"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Món ăn"
              value={stats.totalFoods}
              prefix={<AppstoreOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Đơn hàng gần đây" style={{ marginTop: 24 }}>
        <Table
          dataSource={recentOrders}
          columns={columns}
          rowKey="_id"
          loading={loading}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default DashboardOverview;

