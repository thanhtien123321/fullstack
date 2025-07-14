import React from 'react'
import { Button } from 'antd'

const ButtonComponent = ({
  size,
  styleButton,
  styleTextButton,
  textButton,
  disabled,
  onClick, 
  ...rest
}) => {
  return (
    <Button 
      onClick={onClick} 
      disabled={disabled}
      style={{
        ...styleButton,
        background: disabled ? '#ccc' : styleButton?.background
      }}
      size={size}
      {...rest}
    >
      <span style={styleTextButton}>{textButton}</span>
    </Button>
  );
};


export default ButtonComponent
