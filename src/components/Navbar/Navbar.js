import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Badge, Button, Dropdown, Avatar, Space } from 'antd';
import {
  ShoppingCartOutlined,
  UserOutlined,
  LogoutOutlined,
  HomeOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  LoginOutlined,
} from '@ant-design/icons';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import './Navbar.css';

const { Header } = Layout;

const Navbar = () => {
  const { getCartCount } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const getMenuItems = () => {
    const items = [
      {
        key: '/',
        icon: <HomeOutlined />,
        label: <Link to="/">Trang chủ</Link>,
      },
      {
        key: '/foods',
        icon: <AppstoreOutlined />,
        label: <Link to="/foods">Thực đơn</Link>,
      },
      {
        key: '/orders',
        icon: <UnorderedListOutlined />,
        label: <Link to="/orders">Đơn hàng</Link>,
      },
    ];

    if (user && user.role === 'admin') {
      items.push({
        key: '/admin',
        icon: <AppstoreOutlined />,
        label: <Link to="/admin">Quản trị</Link>,
      });
    }

    return items;
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link to="/profile">Thông tin cá nhân</Link>,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: logout,
    },
  ];

  return (
    <Header className="navbar-header">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🍔</span>
          <span className="logo-text">FoodExpress</span>
        </Link>

        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={getMenuItems()}
          className="navbar-menu"
        />

        <Space size="large" className="navbar-actions">
          <Link to="/cart">
            <Badge count={getCartCount()} showZero offset={[10, 0]}>
              <ShoppingCartOutlined className="nav-icon" />
            </Badge>
          </Link>

          {user ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space className="user-info">
                <Avatar icon={<UserOutlined />} />
                <span className="user-name">{user.name}</span>
              </Space>
            </Dropdown>
          ) : (
            <Link to="/login">
              <Button type="primary" icon={<LoginOutlined />}>
                Đăng nhập
              </Button>
            </Link>
          )}
        </Space>
      </div>
    </Header>
  );
};

export default Navbar;
