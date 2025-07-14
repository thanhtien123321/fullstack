import React from 'react';
import { Checkbox, Rate } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  WrapperLableText,
  WrapperTextValue,
  WrapperContent,
  WrapperTextPrice
} from './style';

const NavBarComponent = () => {
  const navigate = useNavigate();

  const onChange = () => {};

  const handleGoHome = () => {
    navigate('/');
  };

  const renderContent = (type, options) => {
    switch (type) {
      case 'text':
        return options.map((option, index) => (
          <WrapperTextValue key={index}>{option}</WrapperTextValue>
        ));

      case 'checkbox':
        return (
          <Checkbox.Group
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
            onChange={onChange}
          >
            {options.map((option, index) => (
              <Checkbox style={{ marginLeft: 0 }} value={option.value} key={index}>
                {option.label}
              </Checkbox>
            ))}
          </Checkbox.Group>
        );

      case 'star':
        return options.map((option, index) => (
          <div style={{ display: 'flex' }} key={index}>
            <Rate style={{ fontSize: '12px' }} disabled defaultValue={option} />
            <span style={{ marginLeft: '4px' }}>{`Từ ${option} sao`}</span>
          </div>
        ));

      case 'price':
        return options.map((option, index) => (
          <WrapperTextPrice key={index}>{option}</WrapperTextPrice>
        ));

      default:
        return null;
    }
  };

  return (
    <div>
      {/* 🔙 Link về Trang chủ */}
      <div
        onClick={handleGoHome}
        style={{
          cursor: 'pointer',
          fontWeight: 600,
          padding: '8px 0',
          fontSize: '16px',
          color: '#1890ff',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <span>🏠</span> <span>Trang chủ</span>
      </div>

      {/* Label và content của filter */}
      
      <WrapperContent>
        
      </WrapperContent>
    </div>
  );
};

export default NavBarComponent;
