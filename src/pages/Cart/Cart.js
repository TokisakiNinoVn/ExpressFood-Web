import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Row,
  Col,
  Card,
  List,
  InputNumber,
  Button,
  Typography,
  Space,
  Image,
  Divider,
  Empty,
  Input,
  Form,
  message,
  Spin,
} from 'antd';
import {
  DeleteOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import './Cart.css';

const { Title, Text } = Typography;

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user data from localStorage
    const userDataFromStorage = localStorage.getItem('user');
    if (userDataFromStorage) {
      try {
        const parsedUser = JSON.parse(userDataFromStorage);
        setUserData(parsedUser);
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

  const handleQuantityChange = (foodId, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(foodId, newQuantity);
    }
  };

  const handleRemoveItem = (food) => {
    removeFromCart(food._id);
    message.info(`${food.name} đã được xóa khỏi giỏ hàng`);
  };

  const handleCheckout = async (values) => {
    if (!user) {
      message.error('Vui lòng đăng nhập để đặt hàng');
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      message.error('Giỏ hàng trống');
      return;
    }

    try {
      // Update user data in localStorage
      const updatedUser = {
        ...userData,
        phone: values.phone,
        address: {
          street: values.street,
          city: values.city,
        },
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUserData(updatedUser);

      message.success('Đặt hàng thành công!');
      clearCart();
      navigate('/orders');
    } catch (error) {
      console.error('Error updating user data:', error);
      message.error('Đặt hàng thất bại');
    }
  };

  if (loading) {
    return (
      <div className="cart-page" style={{ padding: '50px 0', textAlign: 'center' }}>
        <Spin size="large" tip="Đang tải..." />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <Card>
            <Empty
              image={<ShoppingCartOutlined style={{ fontSize: 80, color: '#ccc' }} />}
              description={
                <Space direction="vertical">
                  <Title level={3}>Giỏ hàng trống</Title>
                  <Text type="secondary">Hãy thêm món ăn vào giỏ hàng để tiếp tục</Text>
                </Space>
              }
            >
              <Button type="primary" size="large" onClick={() => navigate('/foods')}>
                Xem thực đơn
              </Button>
            </Empty>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <Title level={2}>
          <ShoppingCartOutlined /> Giỏ hàng
        </Title>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card title="Món ăn đã chọn">
              <List
                itemLayout="horizontal"
                dataSource={cartItems}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <InputNumber
                        min={1}
                        value={item.quantity}
                        onChange={(value) => handleQuantityChange(item._id, value)}
                      />,
                      <Text strong style={{ color: '#ff6b6b', fontSize: 18, minWidth: 120, textAlign: 'right', display: 'inline-block' }}>
                        {(item.price * item.quantity).toLocaleString('vi-VN')} ₫
                      </Text>,
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemoveItem(item)}
                      />,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Image src={item.image} width={80} height={80} style={{ borderRadius: 8 }} />}
                      title={<Text strong style={{ fontSize: 16 }}>{item.name}</Text>}
                      description={
                        <Text type="secondary">{item.price.toLocaleString('vi-VN')} ₫</Text>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Card title="Địa chỉ giao hàng">
                <Form form={form} layout="vertical" onFinish={handleCheckout}>
                  <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    rules={[
                      { required: true, message: 'Vui lòng nhập số điện thoại' },
                      { pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải có 10 chữ số' },
                    ]}
                  >
                    <Input placeholder="0912345678" />
                  </Form.Item>

                  <Form.Item
                    name="street"
                    label="Số nhà, tên đường"
                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                  >
                    <Input placeholder="456 Lê Lợi" />
                  </Form.Item>

                  <Form.Item
                    name="city"
                    label="Thành phố"
                    rules={[{ required: true, message: 'Vui lòng nhập thành phố' }]}
                  >
                    <Input placeholder="TP. Hồ Chí Minh" />
                  </Form.Item>

                  <Divider />

                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text>Tạm tính:</Text>
                      <Text>{getCartTotal().toLocaleString('vi-VN')} ₫</Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text>Phí giao hàng:</Text>
                      <Text>30,000 ₫</Text>
                    </div>
                    <Divider style={{ margin: '12px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Title level={4} style={{ margin: 0 }}>Tổng cộng:</Title>
                      <Title level={4} style={{ margin: 0, color: '#ff6b6b' }}>
                        {(getCartTotal() + 30000).toLocaleString('vi-VN')} ₫
                      </Title>
                    </div>
                  </Space>

                  <Button
                    type="primary"
                    size="large"
                    icon={<ShoppingOutlined />}
                    htmlType="submit"
                    block
                    style={{ marginTop: 24 }}
                  >
                    Đặt hàng
                  </Button>
                </Form>
              </Card>
            </Space>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Cart;