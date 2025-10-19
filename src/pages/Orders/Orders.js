import React, { useState, useEffect, useContext } from 'react';
import { Card, List, Tag, Typography, Space, Spin, Empty, Timeline, Divider, message } from 'antd';
import axiosInstance from '../../utils/axiosConfig';
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import { AuthContext } from '../../context/AuthContext';
import './Orders.css';

const { Title, Text } = Typography;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get('/api/private/orders');
      setOrders(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      message.error('Không thể tải danh sách đơn hàng');
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { color: 'gold', icon: <ClockCircleOutlined />, text: 'Chờ xác nhận' },
      confirmed: { color: 'cyan', icon: <SyncOutlined />, text: 'Đã xác nhận' },
      preparing: { color: 'orange', icon: <SyncOutlined spin />, text: 'Đang chuẩn bị' },
      delivering: { color: 'blue', icon: <SyncOutlined spin />, text: 'Đang giao' },
      delivered: { color: 'green', icon: <CheckCircleOutlined />, text: 'Đã giao' },
      cancelled: { color: 'red', icon: <CloseCircleOutlined />, text: 'Đã hủy' },
    };
    return configs[status] || configs.pending;
  };

  if (!user) {
    return (
      <div className="orders-page">
        <div className="container">
          <Card>
            <Empty description="Vui lòng đăng nhập để xem đơn hàng" />
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="orders-page">
        <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
          <Spin size="large" tip="Đang tải..." />
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <div className="container">
          <Card>
            <Empty
              image={<ShoppingOutlined style={{ fontSize: 80, color: '#ccc' }} />}
              description={
                <Space direction="vertical">
                  <Title level={3}>Chưa có đơn hàng nào</Title>
                  <Text type="secondary">Hãy đặt món để bắt đầu!</Text>
                </Space>
              }
            />
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        <Title level={2}>
          <ShoppingOutlined /> Đơn hàng của tôi
        </Title>

        <List
          grid={{ gutter: 16, xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }}
          dataSource={orders}
          renderItem={(order) => {
            const statusConfig = getStatusConfig(order.status);
            return (
              <List.Item>
                <Card>
                  <div className="order-header">
                    <Space>
                      <Text strong style={{ fontSize: 18 }}>
                        Đơn hàng #{order._id?.slice(-6)}
                      </Text>
                      <Text type="secondary">
                        {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    </Space>
                    <Tag color={statusConfig.color} icon={statusConfig.icon}>
                      {statusConfig.text}
                    </Tag>
                  </div>

                  <Divider />

                  <List
                    size="small"
                    dataSource={order.items || []}
                    renderItem={(item) => (
                      <List.Item>
                        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                          <Text>{item.food?.name || 'Món ăn'}</Text>
                          <Space>
                            <Text type="secondary">x{item.quantity}</Text>
                            <Text strong style={{ color: '#ff6b6b', minWidth: 100, textAlign: 'right' }}>
                              {(item.price * item.quantity).toLocaleString('vi-VN')} ₫
                            </Text>
                          </Space>
                        </Space>
                      </List.Item>
                    )}
                  />

                  <Divider />

                  <div className="order-footer">
                    <div>
                      <Text strong>Địa chỉ giao hàng:</Text>
                      <br />
                      <Text type="secondary">
                        {order.deliveryAddress?.street}, {order.deliveryAddress?.city}
                      </Text>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <Text strong>Tổng cộng:</Text>
                      <br />
                      <Title level={4} style={{ margin: 0, color: '#ff6b6b' }}>
                        {order.totalAmount?.toLocaleString('vi-VN')} ₫
                      </Title>
                    </div>
                  </div>
                </Card>
              </List.Item>
            );
          }}
        />
      </div>
    </div>
  );
};

export default Orders;
