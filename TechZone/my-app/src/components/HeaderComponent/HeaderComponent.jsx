import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Badge, Popover, Spin } from 'antd';
import {
  UserOutlined,
  CaretDownOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';

import {
  WrapperHeader,
  WrapperTextHeader,
  WrapperHeaderAccount,
  WrapperTextHeaderSmall,
  WrapperContentPopup,
} from './style';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
import * as UserService from '../../services/UserService';
import { resetUser } from '../../redux/slides/userSlide';
import { searchProduct } from '../../redux/slides/productSlide';

const HeaderComponent = ({ isHiddenSearch = false, isHiddenCart = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const order = useSelector((state) => state.order);

  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  const handleNavigateLogin = () => {
    navigate('/sign-in');
  };

  const handleLogout = async () => {
    setLoading(true);
    await UserService.logoutUser();
    localStorage.removeItem('access_token');
    dispatch(resetUser());
    setLoading(false);
  };

  const handleChangeInput = (e) => {
    setSearchText(e.target.value);
  };

  const handleSearchClick = () => {
    dispatch(searchProduct(searchText));
  };

  const content = (
    <div>
      <WrapperContentPopup onClick={() => navigate('/profile-user')}>
        Thông tin người dùng
      </WrapperContentPopup>
      {user.isAdmin && (
        <WrapperContentPopup onClick={() => navigate('/system/admin')}>
          Quản lý hệ thống
        </WrapperContentPopup>
      )}
      <WrapperContentPopup onClick={handleLogout}>Đăng xuất</WrapperContentPopup>
    </div>
  );

  return (
    <div
      style={{
        width: '100%',
        background: '#000',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <WrapperHeader
        style={{
          justifyContent: isHiddenSearch && isHiddenCart ? 'space-between' : 'unset',
        }}
      >
        {/* Logo */}
        <Col
          span={5}
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <WrapperTextHeader>TechZone</WrapperTextHeader>
        </Col>

        {/* Thanh tìm kiếm */}
        {!isHiddenSearch && (
          <Col span={13}>
            <ButtonInputSearch
              size="large"
              textButton="Tìm kiếm"
              placeholder="Tìm sản phẩm, danh mục, thương hiệu mà bạn mong muốn"
              bordered={false}
              backgroundColorInput="#FBEEC1"
              backgroundColorButton="#000"
              textColorButton="#FBEEC1"
              onChange={handleChangeInput}
              onClick={handleSearchClick}
            />
          </Col>
        )}

        {/* Avatar + Tên + Giỏ hàng */}
        <Col
          span={6}
          style={{ display: 'flex', gap: '54px', alignItems: 'center' }}
        >
          <Spin spinning={loading}>
            <WrapperHeaderAccount>
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  style={{
                    height: '30px',
                    width: '30px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <UserOutlined style={{ fontSize: '30px', color: '#FBEEC1' }} />
              )}

              {user?.access_token ? (
                <Popover content={content} trigger="click">
                  <div style={{ cursor: 'pointer' }}>
                    {user?.name?.length ? user?.name : user?.email}
                  </div>
                </Popover>
              ) : (
                <div onClick={handleNavigateLogin} style={{ cursor: 'pointer' }}>
                  <WrapperTextHeaderSmall>Đăng nhập/Đăng ký</WrapperTextHeaderSmall>
                  <div>
                    <WrapperTextHeaderSmall>Tài khoản</WrapperTextHeaderSmall>
                    <CaretDownOutlined style={{ color: '#FBEEC1' }} />
                  </div>
                </div>
              )}
            </WrapperHeaderAccount>
          </Spin>

          {!isHiddenCart && (
            <div onClick={() => navigate('/order')} style={{ cursor: 'pointer' }}>
              <Badge count={order?.orderItems?.length} size="small">
                <ShoppingCartOutlined
                  style={{ fontSize: '30px', color: '#FBEEC1' }}
                />
              </Badge>
              <WrapperTextHeaderSmall>Giỏ hàng</WrapperTextHeaderSmall>
            </div>
          )}
        </Col>
      </WrapperHeader>
    </div>
  );
};

export default HeaderComponent;
