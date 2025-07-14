import React from 'react';
import {
  StyleNameProduct,
  WrapperReportText,
  WrapperPriceText,
  WrapperDiscountText,
  WrapperCardStyle,
  WrapperStyleTextSell
} from './style';
import { StarFilled } from '@ant-design/icons';
import logo from '../../assets/images/logo.png'
import { useNavigate} from 'react-router-dom'
import { convertPrice} from '../../utils'
const CardComponent = (props) => {
  const { countInStock, description, image, name, price, rating, type, discount, selled , id} = props;
  const navigate = useNavigate()
  const handleDetailsProduct = (id) => {
    navigate(`/product-details/${id}`)

  }

  return (
    <WrapperCardStyle
      hoverable
      style={{ width: 200 }}
      bodyStyle={{ padding: '10px' }}
      cover={
        <img
          alt={name}
          src={image} // ✅ dùng ảnh thật từ props
          style={{ height: '200px', objectFit: 'cover' }}
        />}
        onClick={()=>handleDetailsProduct(id)}
    >
      <img
        src={logo}
        style={{
          width: '68px',
          height: '14px',
          position: 'absolute',
          top: -1,
          left: -1,
          borderTopLeftRadius: '3px'
        }}
        alt="logo"
      />
      <StyleNameProduct>{name}</StyleNameProduct>
      <WrapperReportText>
        <span style={{ marginRight: '4px' }}>
          <span>{rating}</span>{' '}
          <StarFilled style={{ fontSize: '12px', color: 'yellow' }} />
        </span>
        <WrapperStyleTextSell>|  Đã bán {selled || 1000}+</WrapperStyleTextSell>
      </WrapperReportText>
      <WrapperPriceText>
        <span style={{ color: '#000', marginRight: '8px' }}>{convertPrice(price)}</span>
        <WrapperDiscountText>{discount || 5}%</WrapperDiscountText>
      </WrapperPriceText>
    </WrapperCardStyle>
  );
};

export default CardComponent;
