import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, Modal, Form, Input, InputNumber, Select, Switch, message, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axiosInstance from '../../utils/axiosConfig';

const { TextArea } = Input;

const FoodsManagement = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [form] = Form.useForm();

  const categories = ['Pizza', 'Burger', 'Pasta', 'Salad', 'Dessert', 'Beverage', 'Asian', 'Mexican', 'Other'];

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/admin/foods');
      setFoods(response.data.data);
    } catch (error) {
      message.error('Không thể tải danh sách món ăn');
    }
    setLoading(false);
  };

  const handleAdd = () => {
    setEditingFood(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingFood(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/admin/foods/${id}`);
      message.success('Xóa món ăn thành công');
      fetchFoods();
    } catch (error) {
      message.error('Xóa món ăn thất bại');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingFood) {
        await axiosInstance.put(`/api/admin/foods/${editingFood._id}`, values);
        message.success('Cập nhật món ăn thành công');
      } else {
        await axiosInstance.post('/api/foods', values);
        message.success('Thêm món ăn thành công');
      }
      setModalVisible(false);
      fetchFoods();
    } catch (error) {
      message.error('Lỗi: ' + (error.response?.data?.message || 'Có lỗi xảy ra'));
    }
  };

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (image) => <Image src={image} width={60} height={60} style={{ objectFit: 'cover', borderRadius: 8 }} />,
    },
    {
      title: 'Tên món',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `${price.toLocaleString('vi-VN')} ₫`,
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => `⭐ ${rating}`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isAvailable',
      key: 'isAvailable',
      render: (isAvailable) => (
        <span style={{ color: isAvailable ? 'green' : 'red' }}>
          {isAvailable ? '✓ Còn hàng' : '✗ Hết hàng'}
        </span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)} size="small">
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa món này?"
            onConfirm={() => handleDelete(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger icon={<DeleteOutlined />} size="small">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm món mới
        </Button>
      </div>

      <Table
        dataSource={foods}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingFood ? 'Chỉnh sửa món ăn' : 'Thêm món mới'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="name" label="Tên món" rules={[{ required: true, message: 'Vui lòng nhập tên món' }]}>
            <Input placeholder="Ví dụ: Pizza Margherita" />
          </Form.Item>

          <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
            <TextArea rows={3} placeholder="Mô tả món ăn" />
          </Form.Item>

          <Form.Item name="price" label="Giá (VNĐ)" rules={[{ required: true, message: 'Vui lòng nhập giá' }]}>
            <InputNumber style={{ width: '100%' }} min={0} placeholder="159000" />
          </Form.Item>

          <Form.Item name="category" label="Danh mục" rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}>
            <Select placeholder="Chọn danh mục">
              {categories.map(cat => (
                <Select.Option key={cat} value={cat}>{cat}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="image" label="URL hình ảnh" rules={[{ required: true, message: 'Vui lòng nhập URL hình ảnh' }]}>
            <Input placeholder="https://example.com/image.jpg" />
          </Form.Item>

          <Form.Item name="preparationTime" label="Thời gian chuẩn bị (phút)" initialValue={20}>
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>

          <Form.Item name="isAvailable" label="Còn hàng" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingFood ? 'Cập nhật' : 'Thêm mới'}
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FoodsManagement;

