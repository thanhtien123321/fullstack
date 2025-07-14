// src/pages/HomePage/HomePage.js
import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { Dropdown, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import SliderComponent from '../../components/SliderComponent/SliderComponent';
import TypeProduct from '../../components/TypeProduct/TypeProduct';
import CardComponent from '../../components/CardComponent/CardComponent';
import * as ProductService from '../../services/ProductService';

import {
  WrapperTypeProduct,
  WrapperButtonMore,
  WrapperProducts
} from './style';

import slider4 from '../../assets/images/slider4.webp';
import slider2 from '../../assets/images/slider2.webp';
import slider3 from '../../assets/images/slider3.webp';
import slider5 from '../../assets/images/slider5.webp';

const HomePage = () => {
  const searchProduct = useSelector((state) => state.product?.search);
  const [visibleCount, setVisibleCount] = useState(12);
  const [typeProducts, setTypeProducts] = useState([]);
  const refSearch = useRef();

  const fetchProductAll = async (search) => {
    const res = await ProductService.getAllProduct({ name: search }, false);
    return res;
  };
  

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    if (res?.status === 'ok') {
      // Log thử để kiểm tra kỹ
      console.log('Raw types:', res.data);
  
      // Chuẩn hóa dữ liệu: loại bỏ khoảng trắng + ký tự vô hình
      const cleanedTypes = res.data.map(type =>
        type.replace(/\s+/g, ' ').trim()
      );
  
      // Lọc trùng
      const unique = Array.from(new Set(cleanedTypes));
  
      console.log('Cleaned unique types:', unique);
  
      setTypeProducts(unique);
    }
  };
  
  

  const { data: products } = useQuery({
    queryKey: ['products', searchProduct],
    queryFn: () => fetchProductAll(searchProduct),
  });

  useEffect(() => {
    if (refSearch.current) {
      fetchProductAll(searchProduct);
    }
    refSearch.current = true;
  }, [searchProduct]);

  useEffect(() => {
    fetchAllTypeProduct();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 12);
  };

  const renderTypeMenu = (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: '10px',
        padding: '12px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        borderRadius: '8px',
        maxWidth: '500px',
        minWidth: '300px',
      }}
    >
      {typeProducts.map((item) => (
        <TypeProduct name={item} key={item} />
      ))}
    </div>
  );

  return (
    <>
      <div style={{ width: '1270px', margin: '0 auto', padding: '16px 0' }}>
  <WrapperTypeProduct>
    {typeProducts.map((item) => (
      <TypeProduct name={item} key={item} />
    ))}
  </WrapperTypeProduct>
</div>


      <div className="body" style={{ width: '100%', backgroundColor: '#efefef' }} />

      <div
        id="container"
        style={{
          minHeight: '1000px',
          width: '1270px',
          margin: '0 auto',
        }}
      >
        <SliderComponent arrImages={[slider5, slider2, slider3, slider4]} />

        <WrapperProducts>
          {products?.data?.slice(0, visibleCount).map((product) => (
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

        {visibleCount < products?.data?.length && (
          <div
            style={{
              justifyContent: 'center',
              width: '100%',
              display: 'flex',
              marginTop: '10px',
            }}
          >
            <WrapperButtonMore
              onClick={handleLoadMore}
              textButton="Xem thêm"
              type="outline"
              styleButton={{
                border: '1px solid rgb(11 , 116 , 229)',
                color: 'rgb(11 , 116 , 229)',
                width: '240px',
                height: '38px',
                borderRadius: '4px',
              }}
              styleTextButton={{ fontWeight: 500 }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;
