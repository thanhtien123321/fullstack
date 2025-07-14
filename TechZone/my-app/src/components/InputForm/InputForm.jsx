import React from 'react';
import { WrapperInputStyle } from './style';

const InputForm = ({ placeholder = 'Nhập text', onChange, isEvent = false, ...rests }) => {
  const handleChange = (e) => {
    if (isEvent) {
      onChange(e); // Trả nguyên event
    } else {
      onChange(e.target.value); // Trả value trực tiếp
    }
  };

  return (
    <WrapperInputStyle
      placeholder={placeholder}
      onChange={handleChange}
      {...rests}
    />
  );
};

export default InputForm;
