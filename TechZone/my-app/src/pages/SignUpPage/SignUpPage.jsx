import React, { useState, useEffect } from 'react';
import {
  WrapperContainerLeft,
  WrapperContainerRight,
  WrapperTextLight
} from './style';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import InputForm from '../../components/InputForm/InputForm';
import imageLogo from '../../assets/images/logo-login4.png';
import { Image } from 'antd';
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import * as UserService from '../../services/UserService';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as message from '../../components/Message/Message';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const mutation = useMutationHooks((data) => UserService.signupUser(data));
  const { data, isLoading, isSuccess, isError } = mutation;

  useEffect(() => {
    if (isSuccess) {
      message.success('Đăng ký thành công!');
      handleNavigateSignIn();
    } else if (isError) {
      message.error('Đăng ký thất bại!');
    }
  }, [isSuccess, isError]);

  const handleOnchangeEmail = (value) => setEmail(value);
  const handleOnchangePassword = (value) => setPassword(value);
  const handleOnchangeConfirmPassword = (value) => setConfirmPassword(value);
  const handleNavigateSignIn = () => navigate('/sign-in');

  const handleSignUp = () => {
    mutation.mutate({ email, password, confirmPassword });
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0, 0, 0, 0.53)',
      height: '100vh'
    }}>
      <div style={{
        width: '800px',
        height: '445px',
        borderRadius: '6px',
        background: '#fff',
        display: 'flex'
      }}>
        <WrapperContainerLeft>
          <h1>Xin chào</h1>
          <p>Đăng ký tài khoản mới</p>

          <InputForm
            style={{ marginBottom: '10px' }}
            placeholder="@gmail.com"
            value={email}
            onChange={handleOnchangeEmail}
          />

          <div style={{ position: 'relative', marginBottom: '10px' }}>
            <span
              onClick={() => setIsShowPassword(!isShowPassword)}
              style={{
                zIndex: 10, position: 'absolute', top: '4px', right: '8px', cursor: 'pointer'
              }}
            >
              {isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
            </span>
            <InputForm
              placeholder="Password"
              type={isShowPassword ? 'text' : 'password'}
              value={password}
              onChange={handleOnchangePassword}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <span
              onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
              style={{
                zIndex: 10, position: 'absolute', top: '4px', right: '8px', cursor: 'pointer'
              }}
            >
              {isShowConfirmPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
            </span>
            <InputForm
              placeholder="Confirm password"
              type={isShowConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={handleOnchangeConfirmPassword}
            />
          </div>

          {data?.status === 'ERR' && (
            <span style={{ color: 'red' }}>{data?.message}</span>
          )}

          <ButtonComponent
            disabled={!email || !password || !confirmPassword || password !== confirmPassword}
            onClick={handleSignUp}
            bordered={false}
            size={40}
            styleButton={{
              background: 'black',
              height: '48px',
              width: '100%',
              border: 'none',
              borderRadius: '4px',
              margin: '26px 0 10px'
            }}
            loading={isLoading}
            textButton={'Đăng ký'}
            styleTextButton={{
              color: '#fff',
              fontSize: '15px',
              fontWeight: '700'
            }}
          />

          <p>
            Bạn đã có tài khoản{' '}
            <WrapperTextLight onClick={handleNavigateSignIn}>
              Đăng nhập
            </WrapperTextLight>
          </p>
        </WrapperContainerLeft>

        <WrapperContainerRight>
          <Image src={imageLogo} preview={false} alt="image-logo" />
          <h4>Mua sắm tại TechZone</h4>
        </WrapperContainerRight>
      </div>
    </div>
  );
};

export default SignUpPage;
