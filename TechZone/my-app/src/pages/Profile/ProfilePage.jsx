import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import InputForm from '../../components/InputForm/InputForm';
import {
  WrapperHeader,
  WrapperContentProfile,
  WrapperLabel,
  WrapperInput,
  WrapperUploadFile
} from './style';
import * as UserService from '../../services/UserService';
import { message, Upload, Button } from 'antd';
import { updateUser } from '../../redux/slides/userSlide';
import { useMutationHooks } from '../../hooks/useMutationHook';
import { UploadOutlined } from '@ant-design/icons';
import { getBase64 } from '../../../src/utils';

const ProfilePage = () => {
  const user = useSelector((state) => state.user);
  console.log('User in Redux:', user);
  const dispatch = useDispatch();

  const [email, setEmail] = useState(user?.email);
  const [name, setName] = useState(user?.name);
  const [phone, setPhone] = useState(user?.phone);
  const [address, setAddress] = useState(user?.address);
  const [avatar, setAvatar] = useState(user?.avatar);
  const [avatarPreview, setAvatarPreview] = useState('');


  const mutation = useMutationHooks((data) => {
    const { id, access_token, formData} = data;
    return UserService.updateUser(id, formData, access_token);
  });

  const { isSuccess, isError } = mutation;

  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token }));
  };

  const handleOnchangeEmail = (e) => setEmail(e.target.value);
  const handleOnchangeName = (e) => setName(e.target.value);
  const handleOnchangePhone = (e) => setPhone(e.target.value);
  const handleOnchangeAddress = (e) => setAddress(e.target.value);

  const handleOnchangeAvatar = async ({ file }) => {
    const fileObj = file.originFileObj;
    setAvatar(fileObj); // ảnh thật để gửi lên server
    const previewURL = URL.createObjectURL(fileObj);
    setAvatarPreview(previewURL); // ảnh preview để hiển thị ngay
  };
  
  

  useEffect(() => {
    setEmail(user?.email);
    setName(user?.name);
    setPhone(user?.phone);
    setAddress(user?.address);
    setAvatar(user?.avatar);
  
    if (typeof user?.avatar === 'string') {
      setAvatarPreview(user.avatar); // ảnh dạng string từ server
    }
  }, [user]);
  

  useEffect(() => {
    if (isSuccess) {
      message.success('Cập nhật thành công');
      handleGetDetailsUser(user?.id, user?.access_token);
    } else if (isError) {
      message.error('Cập nhật thất bại');
    }
  }, [isSuccess, isError]);

  const handleUpdate = () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('address', address);
    if (avatar) {
      formData.append('avatar', avatar); // Gửi file thật
    }
  
    mutation.mutate({
      id: user?.id,
      access_token: user?.access_token,
      formData,
    });
  };
  

  return (
    <div style={{ width: '1270px', margin: '0 auto', height: '500px' }}>
      <WrapperHeader>Thông tin người dùng</WrapperHeader>
      <WrapperContentProfile>
        {/* Name */}
        <WrapperInput>
          <WrapperLabel htmlFor="name">Name</WrapperLabel>
          <InputForm
            style={{ width: '300px' }}
            id="name"
            value={name}
            onChange={handleOnchangeName}
            isEvent={true}
          />
          <ButtonComponent
            onClick={handleUpdate}
            size={40}
            styleButton={{
              height: '30px',
              width: 'fit-content',
              borderRadius: '4px',
              padding: '2px 6px 6px'
            }}
            textButton={'Cập nhật'}
            styleTextButton={{
              color: 'rgb(26 , 148 , 255)',
              fontSize: '15px',
              fontWeight: '700'
            }}
          />
        </WrapperInput>

        {/* Email */}
        <WrapperInput>
          <WrapperLabel htmlFor="email">Email</WrapperLabel>
          <InputForm
            style={{ width: '300px' }}
            id="email"
            value={email}
            onChange={handleOnchangeEmail}
            isEvent={true}
          />
          <ButtonComponent
            onClick={handleUpdate}
            size={40}
            styleButton={{
              height: '30px',
              width: 'fit-content',
              borderRadius: '4px',
              padding: '2px 6px 6px'
            }}
            textButton={'Cập nhật'}
            styleTextButton={{
              color: 'rgb(26 , 148 , 255)',
              fontSize: '15px',
              fontWeight: '700'
            }}
          />
        </WrapperInput>

        {/* Phone */}
        <WrapperInput>
          <WrapperLabel htmlFor="phone">Phone</WrapperLabel>
          <InputForm
            style={{ width: '300px' }}
            id="phone"
            value={phone}
            onChange={handleOnchangePhone}
            isEvent={true}
          />
          <ButtonComponent
            onClick={handleUpdate}
            size={40}
            styleButton={{
              height: '30px',
              width: 'fit-content',
              borderRadius: '4px',
              padding: '2px 6px 6px'
            }}
            textButton={'Cập nhật'}
            styleTextButton={{
              color: 'rgb(26 , 148 , 255)',
              fontSize: '15px',
              fontWeight: '700'
            }}
          />
        </WrapperInput>

        {/* Avatar */}
        <WrapperInput>
          <WrapperLabel htmlFor="avatar">Avatar</WrapperLabel>
          <WrapperUploadFile
  onChange={handleOnchangeAvatar}
  maxCount={1}
  showUploadList={false}
  
>
  <Button icon={<UploadOutlined />}>Click to Upload</Button>
</WrapperUploadFile>

          {avatarPreview && (
  <img
    src={avatarPreview}
    style={{
      height: '60px',
      width: '60px',
      borderRadius: '50%',
      objectFit: 'cover',
      marginTop: '8px'
    }}
    alt="avatar"
  />
)}

          <ButtonComponent
            onClick={handleUpdate}
            size={40}
            styleButton={{
              height: '30px',
              width: 'fit-content',
              borderRadius: '4px',
              padding: '2px 6px 6px',
              marginTop: '8px'
            }}
            textButton={'Cập nhật'}
            styleTextButton={{
              color: 'rgb(26 , 148 , 255)',
              fontSize: '15px',
              fontWeight: '700'
            }}
          />
        </WrapperInput>

        {/* Address */}
        <WrapperInput>
          <WrapperLabel htmlFor="address">Address</WrapperLabel>
          <InputForm
            style={{ width: '300px' }}
            id="address"
            value={address}
            onChange={handleOnchangeAddress}
            isEvent={true}
          />
          <ButtonComponent
            onClick={handleUpdate}
            size={40}
            styleButton={{
              height: '30px',
              width: 'fit-content',
              borderRadius: '4px',
              padding: '2px 6px 6px'
            }}
            textButton={'Cập nhật'}
            styleTextButton={{
              color: 'rgb(26 , 148 , 255)',
              fontSize: '15px',
              fontWeight: '700'
            }}
          />
        </WrapperInput>
      </WrapperContentProfile>
    </div>
  );
};

export default ProfilePage;
