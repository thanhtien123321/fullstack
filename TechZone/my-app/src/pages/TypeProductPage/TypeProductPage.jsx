import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Col, Row, Pagination } from 'antd';

import NavBarComponent from '../../components/NavbarComponent/NavBarComponent';
import CardComponent from '../../components/CardComponent/CardComponent';
import * as ProductService from '../../services/ProductService';

import { WrapperNavbar, WrapperProducts } from './style';

const TypeProductPage = () => {
  const { type } = useParams();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    const fetchProductsByType = async () => {
      try {
        const res = await ProductService.getAllProduct({ type: type }, false); // 👈 sửa dòng này
  
        if (res?.status === 'ok') {
          setProducts(res.data || []);
        }
      } catch (error) {
        console.error('Lỗi khi fetch sản phẩm theo type:', error);
      }
    };
  
    fetchProductsByType();
  }, [type]);
  
  

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const currentData = products.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div style={{ width: '100%', background: '#efefef' }}>
      <div style={{ width: '1270px', margin: '0 auto' }}>
        <Row style={{ flexWrap: 'nowrap', paddingTop: '10px' }}>
          <WrapperNavbar span={4}>
            <NavBarComponent />
          </WrapperNavbar>
          <Col span={20}>
            <h2 style={{ padding: '10px 0' }}>Danh mục: <span style={{ color: '#1890ff' }}>{type}</span></h2>
            <WrapperProducts>
              {currentData.map((product) => (
                <CardComponent
                  key={product._id}
                  countInStock={product.countInStock}
                  description={product.description}
                  image={`${process.env.REACT_APP_IMAGE_URL}${product.image}`}
                  name={product.name}
                  price={product.price}
                  rating={product.rating}
                  type={product.type}
                  selled={product.selled}
                  discount={product.discount}
                  id={product._id}
                />
              ))}
            </WrapperProducts>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={products.length}
                onChange={handleChangePage}
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default TypeProductPage;
