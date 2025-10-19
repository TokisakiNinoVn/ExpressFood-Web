import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Card, Input, Button, Rate, Tag, Spin, Empty, Space, message } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { CartContext } from '../../context/CartContext';
import axios from 'axios';
import './Foods.css';

const { Meta } = Card;

const Foods = () => {
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const { addToCart } = useContext(CartContext);

  const categories = ['All', 'Pizza', 'Burger', 'Pasta', 'Salad', 'Dessert', 'Beverage', 'Asian', 'Mexican'];

  useEffect(() => {
    fetchFoods();
  }, []);

  useEffect(() => {
    filterFoods();
  }, [selectedCategory, searchTerm, foods]);

  const fetchFoods = async () => {
    try {
      const response = await axios.get('/api/public/foods');
      setFoods(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching foods:', error);
      setLoading(false);
      message.error('Không thể tải danh sách món ăn');
    }
  };

  const filterFoods = () => {
    let filtered = foods;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(food => food.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(food =>
        food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        food.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredFoods(filtered);
  };

  const handleAddToCart = (food) => {
    addToCart(food);
    message.success(`${food.name} đã được thêm vào giỏ hàng!`);
  };

  if (loading) {
    return (
      <div className="foods-page">
        <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
          <Spin size="large" tip="Đang tải..." />
        </div>
      </div>
    );
  }

  return (
    <div className="foods-page">
      <div className="container">
        <div className="foods-header">
          <h1 className="page-title">Thực đơn</h1>
          <Input
            placeholder="Tìm kiếm món ăn..."
            prefix={<SearchOutlined />}
            size="large"
            style={{ maxWidth: 400 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear
          />
        </div>

        <div className="categories-section">
          <Space wrap>
            {categories.map(category => (
              <Button
                key={category}
                type={selectedCategory === category ? 'primary' : 'default'}
                onClick={() => setSelectedCategory(category)}
                size="large"
              >
                {category}
              </Button>
            ))}
          </Space>
        </div>

        {filteredFoods.length > 0 ? (
          <Row gutter={[24, 24]}>
            {filteredFoods.map(food => (
              <Col xs={24} sm={12} lg={8} xl={6} key={food._id}>
                <Card
                  hoverable
                  cover={
                    <div className="food-image-wrapper">
                      <img alt={food.name} src={food.image} />
                      <Tag color="red" className="food-category-tag">
                        {food.category}
                      </Tag>
                    </div>
                  }
                  actions={[
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => handleAddToCart(food)}
                      disabled={!food.isAvailable}
                    >
                      Thêm
                    </Button>,
                  ]}
                >
                  <Meta
                    title={food.name}
                    description={
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <div className="food-description">{food.description}</div>
                        <div className="food-rating">
                          <Rate disabled defaultValue={food.rating} style={{ fontSize: 14 }} />
                          <span className="reviews">({food.reviews})</span>
                        </div>
                        <div className="food-price">{food.price.toLocaleString('vi-VN')} ₫</div>
                      </Space>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Empty
            description="Không tìm thấy món ăn nào"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </div>
    </div>
  );
};

export default Foods;
