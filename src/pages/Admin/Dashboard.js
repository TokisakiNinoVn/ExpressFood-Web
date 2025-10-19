import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Menu, Card, Row, Col, Statistic, message } from 'antd';
import {
  DashboardOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { AuthContext } from '../../context/AuthContext';
import FoodsManagement from '../../components/Admin/FoodsManagement';
import OrdersManagement from '../../components/Admin/OrdersManagement';
import UsersManagement from '../../components/Admin/UsersManagement';
import DashboardOverview from '../../components/Admin/DashboardOverview';
import './Dashboard.css';

const { Header, Sider, Content } = Layout;

const Dashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState('overview');
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      message.error('Bạn không có quyền truy cập trang này');
      navigate('/');
    }
  }, [user, navigate]);

  const menuItems = [
    {
      key: 'overview',
      icon: <DashboardOutlined />,
      label: 'Tổng quan',
    },
    {
      key: 'foods',
      icon: <AppstoreOutlined />,
      label: 'Quản lý món ăn',
    },
    {
      key: 'orders',
      icon: <ShoppingOutlined />,
      label: 'Quản lý đơn hàng',
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: 'Quản lý người dùng',
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    message.success('Đăng xuất thành công');
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case 'overview':
        return <DashboardOverview />;
      case 'foods':
        return <FoodsManagement />;
      case 'orders':
        return <OrdersManagement />;
      case 'users':
        return <UsersManagement />;
      default:
        return <DashboardOverview />;
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <Layout className="admin-dashboard">
      <Sider width={250} className="dashboard-sider">
        <div className="dashboard-logo">
          <h2>🍔 FoodExpress Admin</h2>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedMenu]}
          items={menuItems}
          onClick={({ key }) => setSelectedMenu(key)}
        />
        <div className="logout-section">
          <Menu
            mode="inline"
            items={[
              {
                key: 'logout',
                icon: <LogoutOutlined />,
                label: 'Đăng xuất',
                onClick: handleLogout,
              },
            ]}
          />
        </div>
      </Sider>
      <Layout>
        <Header className="dashboard-header">
          <div className="header-content">
            <h2 className="page-title">
              {menuItems.find(item => item.key === selectedMenu)?.label}
            </h2>
            <div className="user-info">
              <span>Xin chào, {user?.name}</span>
            </div>
          </div>
        </Header>
        <Content className="dashboard-content">
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;

