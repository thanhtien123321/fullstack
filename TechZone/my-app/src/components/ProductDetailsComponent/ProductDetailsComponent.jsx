import React, { useState } from 'react';
import { Col, Image, Row, InputNumber, Rate } from 'antd';
import imageProductSmall from '../../assets/images/testsmall.webp';
import ButtonComponent from '../ButtonComponent/ButtonComponent';

import {
  WrapperStyleImageSmall,
  WrapperStyleColImage,
  WrapperStyleNameProduct,
  WrapperStyleTextSell,
  WrapperPriceProduct,
  WrapperPriceTextProduct,
  WrapperAddressProduct,
  WrapperQualityProduct,
  WrapperInputNumber,
} from './style';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import * as ProductService from '../../services/ProductService';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux'
import {useNavigate , useLocation} from 'react-router-dom'
import {addOrderProduct} from '../../redux/slides/orderSlide'
import { useDispatch} from 'react-redux';
import {convertPrice} from '../../utils'
const ProductDetailsComponent = ({ idProduct }) => {
  const [numProduct, setNumProduct] = useState(1);
  const user = useSelector((state)=> state.user)
  
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const onChange = (value) => {
    if (value >= 1) {
      setNumProduct(value);
    }
  };

  

  const handleChangeCount = (type) => {
    if (type === 'increase') {
      setNumProduct((prev) => prev + 1);
    } else {
      setNumProduct((prev) => (prev > 1 ? prev - 1 : 1));
    }
  };

  const handleAddOrderProduct = () => {
    if(!user?.id){
      navigate('/sign-in', { state: { from: location.pathname } });
    }else {
      dispatch(addOrderProduct({
        orderItem: {
          name : productDetails?.name,
          amount: numProduct,
          image : productDetails?.image,
          price : productDetails?.price,
          product : productDetails?._id
        }
      }))
    }
  
  }
  

  const fetchGetDetailsProduct = async (context) => {
    const id = context?.queryKey && context?.queryKey[1];
    if (id) {
      const res = await ProductService.getDetailsProduct(id);
      return res.data;
    }
  };

  const { data: productDetails } = useQuery({
    queryKey: ['product-details', idProduct],
    queryFn: fetchGetDetailsProduct,
    enabled: !!idProduct,
  });
  

  if (!productDetails) {
    return <div>Loading...</div>;
  }
  console.log('productDetails' , productDetails, user)

  return (
    <Row style={{ padding: '16px', background: '#fff', borderRadius: '4px' }}>
      <Col span={10} style={{ borderRight: '1px solid #e5e5e5', paddingRight: '8px' }}>
        <Image src={productDetails?.image} alt="image product" preview={false} />
        <Row gutter={[8, 8]} style={{ paddingTop: '10px' }} wrap={false}>
          {[...Array(6)].map((_, index) => (
            <WrapperStyleColImage span={4} key={index}>
              <WrapperStyleImageSmall src={productDetails?.image} alt="image small" preview={false} />
            </WrapperStyleColImage>
          ))}
        </Row>
      </Col>

      <Col span={14} style={{ paddingLeft: '10px' }}>
        <WrapperStyleNameProduct>{productDetails?.name}</WrapperStyleNameProduct>
        <div>
          <Rate allowHalf defaultValue={productDetails?.rating} value={productDetails?.rating} />
          <WrapperStyleTextSell>| Đã bán 1000+</WrapperStyleTextSell>
        </div>
        <WrapperPriceProduct>
          <WrapperPriceTextProduct>{convertPrice(productDetails?.price)}</WrapperPriceTextProduct>
        </WrapperPriceProduct>
        <WrapperAddressProduct>
          <span>Giao đến - </span>
          <span className="address">{user?.address}</span> -
          <span className="change-address"> Đổi địa chỉ  </span>
        </WrapperAddressProduct>

        <div
          style={{
            margin: '10px 0 20px',
            padding: '10px 0',
            borderTop: '1px solid #e5e5e5',
            borderBottom: '1px solid #ccc',
          }}
        >
          <div style={{ marginBottom: '10px' }}>Số lượng</div>
          <WrapperQualityProduct>
            <button
              style={{ border: 'none', background: 'transparent',cursor : 'pointer' }}
              onClick={() => handleChangeCount('decrease')}
            >
              <MinusOutlined style={{ color: '#000', fontSize: '20px' }} />
            </button>

            <WrapperInputNumber
              min={1}
              onChange={onChange}
              value={numProduct}
              size="small"
            />

            <button
              style={{ border: 'none', background: 'transparent',cursor : 'pointer' }}
              onClick={() => handleChangeCount('increase')}
            >
              <PlusOutlined style={{ color: '#000', fontSize: '20px' }} />
            </button>
          </WrapperQualityProduct>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ButtonComponent
            bordered={false}
            size={40}
            styleButton={{
              background: 'rgb(255, 57, 69)',
              height: '48px',
              width: '220px',
              border: 'none',
              borderRadius: '4px',
            }}
            onClick={handleAddOrderProduct}
            textButton={'Chọn mua'}
            styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
          />
          <ButtonComponent
            size={40}
            styleButton={{
              background: '#fff',
              height: '48px',
              width: '220px',
              border: '1px solid rgb(13, 92, 182)',
              borderRadius: '4px',
            }}
            textButton={'Mua trả góp'}
            styleTextButton={{ color: 'rgb(15, 92, 182)', fontSize: '15px' }}
          />
        </div>
      </Col>
      
    </Row>
  );
};

export default ProductDetailsComponent;
