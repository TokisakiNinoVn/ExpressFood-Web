import React, { useState, useEffect } from 'react';
import { Table, Tag, Select, message, Space, Modal } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import axiosInstance from '../../utils/axiosConfig';

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/orders');
      setOrders(response.data.data);
    } catch (error) {
      message.error('Không thể tải danh sách đơn hàng');
    }
    setLoading(false);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axiosInstance.put(`/api/orders/${orderId}/status`, { status: newStatus });
      message.success('Cập nhật trạng thái thành công');
      fetchOrders();
    } catch (error) {
      message.error('Cập nhật trạng thái thất bại');
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

  const statusOptions = [
    { label: 'Chờ xác nhận', value: 'pending' },
    { label: 'Đã xác nhận', value: 'confirmed' },
    { label: 'Đang chuẩn bị', value: 'preparing' },
    { label: 'Đang giao', value: 'delivering' },
    { label: 'Đã giao', value: 'delivered' },
    { label: 'Đã hủy', value: 'cancelled' },
  ];

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
      render: (user) => (
        <div>
          <div>{user?.name || 'N/A'}</div>
          <div style={{ fontSize: 12, color: '#999' }}>{user?.email}</div>
        </div>
      ),
    },
    {
      title: 'Số món',
      dataIndex: 'items',
      key: 'items',
      render: (items) => items?.length || 0,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => `${amount?.toLocaleString('vi-VN')} ₫`,
    },
    {
      title: 'Thanh toán',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (method) => {
        const labels = {
          cash: 'Tiền mặt',
          card: 'Thẻ',
          online: 'Online',
        };
        return labels[method] || method;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Select
          value={status}
          onChange={(value) => handleStatusChange(record._id, value)}
          style={{ width: 140 }}
          size="small"
        >
          {statusOptions.map(option => (
            <Select.Option key={option.value} value={option.value}>
              <Tag color={getStatusColor(option.value)}>{option.label}</Tag>
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <a onClick={() => { setSelectedOrder(record); setModalVisible(true); }}>
            <EyeOutlined /> Chi tiết
          </a>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table
        dataSource={orders}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={`Chi tiết đơn hàng #${selectedOrder?._id?.slice(-6)}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedOrder && (
          <div>
            <h3>Thông tin khách hàng</h3>
            <p><strong>Tên:</strong> {selectedOrder.user?.name}</p>
            <p><strong>Email:</strong> {selectedOrder.user?.email}</p>
            <p><strong>SĐT:</strong> {selectedOrder.user?.phone}</p>

            <h3 style={{ marginTop: 20 }}>Địa chỉ giao hàng</h3>
            <p>
              {selectedOrder.deliveryAddress?.street}, {selectedOrder.deliveryAddress?.city}, {selectedOrder.deliveryAddress?.zipCode}
            </p>

            <h3 style={{ marginTop: 20 }}>Món ăn</h3>
            <Table
              dataSource={selectedOrder.items}
              pagination={false}
              size="small"
              columns={[
                {
                  title: 'Món',
                  dataIndex: 'food',
                  render: (food) => food?.name || 'N/A',
                },
                {
                  title: 'SL',
                  dataIndex: 'quantity',
                },
                {
                  title: 'Giá',
                  dataIndex: 'price',
                  render: (price) => `${price?.toLocaleString('vi-VN')} ₫`,
                },
                {
                  title: 'Tổng',
                  render: (_, record) => `${(record.price * record.quantity).toLocaleString('vi-VN')} ₫`,
                },
              ]}
            />

            <div style={{ marginTop: 20, textAlign: 'right' }}>
              <h3>Tổng cộng: {selectedOrder.totalAmount?.toLocaleString('vi-VN')} ₫</h3>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrdersManagement;

