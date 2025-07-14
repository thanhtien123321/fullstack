import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as ProductService from '../../services/ProductService';
import CardComponent from '../../components/CardComponent/CardComponent';
import { WrapperProducts, WrapperButtonMore } from '../HomePage/style';

const TypePage = () => {
  const { name } = useParams();
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12);

  const fetchProductsByType = async () => {
    const res = await ProductService.getAllProduct(`type:${name}`, false);
    if (res?.status === 'ok') {
      setProducts(res.data);
    }
  };

  useEffect(() => {
    fetchProductsByType();
  }, [name]);

  return (
    <div style={{ width: '1270px', margin: '0 auto', paddingTop: 16 }}>
      <h2>Sản phẩm thuộc loại: <span style={{ color: 'blue' }}>{name}</span></h2>
      <WrapperProducts>
        {products.slice(0, visibleCount).map(product => (
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

      {visibleCount < products.length && (
        <div style={{ justifyContent: 'center', width: '100%', display: 'flex', marginTop: '10px' }}>
          <WrapperButtonMore
            onClick={() => setVisibleCount(prev => prev + 12)}
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
  );
};

export default TypePage;
