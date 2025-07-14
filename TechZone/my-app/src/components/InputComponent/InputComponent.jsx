import React from 'react'
import { Input } from 'antd'

const InputComponent = ({ size, placeholder, bordered = true, style = {}, ...rest }) => {
  return (
    <Input
      size={size}
      placeholder={placeholder}
      bordered={bordered}
      style={{
        backgroundColor: 'white', // hoặc một biến như backgroundColorInput nếu đã định nghĩa trước đó
        border: bordered === false ? 'none' : undefined,
        boxShadow: 'none',
        ...style
      }}
      {...rest}
    />
  );
};

export default InputComponent;
