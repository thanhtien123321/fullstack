import React from 'react';
import { Image } from 'antd';
import {WrapperSliderStyle} from './style';

const SliderComponent = ({ arrImages }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
    autoplay: true, // cho ảnh tự chạy
    autoplaySpeed: 1500, // thời gian chạy tự động (ms)
    arrows: false, // ẩn nút trái phải nếu muốn
  };

  return (
    <WrapperSliderStyle {...settings}>
    {arrImages.map((image) =>{
      return (
        <Image src={image} alt ="slider" preview={false} width="100%" height="274px"/>
      )
    })}

    </WrapperSliderStyle>
  )
}

export default SliderComponent;
