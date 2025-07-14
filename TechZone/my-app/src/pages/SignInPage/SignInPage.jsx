import React, { useState  , useEffect } from 'react';
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import InputForm from '../../components/InputForm/InputForm';
import imageLogo from '../../assets/images/logo-login4.png';
import { Image } from 'antd';
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as UserService from '../../services/UserService';
import Loading from '../../components/LoadingComponent/Loading'
import * as message from '../../components/Message/Message'
import {jwtDecode} from "jwt-decode"
import { useDispatch} from 'react-redux'
import { updateUser } from '../../redux/slides/userSlide';
import {useLocation} from 'react-router-dom'
import { getCart } from '../../services/CartService';
import { setOrderItems } from '../../redux/slides/orderSlide';


const SignInPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const location = useLocation()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const redirectPath = location?.state?.from || '/';

  const mutation = useMutationHooks(
    data => UserService.loginUser(data)
  );
  const { data, isPending  , isSuccess  } = mutation;

  useEffect(() => {
    console.log('📦 location in useEffect:', location);
    if (isSuccess && data?.access_token && data?.user) {
      localStorage.setItem('access_token', data.access_token);
      const decoded = jwtDecode(data.access_token);
  
      dispatch(updateUser({
        ...data.user,
        access_token: data.access_token,
        isAdmin: decoded?.isAdmin || false
      }));
  
      // 🔽 GỌI API GIỎ HÀNG SAU KHI ĐĂNG NHẬP THÀNH CÔNG
      const fetchCart = async () => {
        try {
          const resCart = await getCart();
          if (resCart?.status === 'OK') {
            dispatch(setOrderItems(resCart.data)); // Lưu vào Redux
          }
        } catch (error) {
          console.error('❌ Lỗi khi lấy giỏ hàng:', error);
        }
      };
  
      fetchCart(); // Gọi luôn
  
      const redirectPath = location?.state?.from || '/';
      navigate(redirectPath);
    }
  }, [isSuccess]);
  
  
  
  
  
  
  
 
 

  const handleNavigateSignUp = () => {
    navigate('/sign-up');
  };

  const handleOnchangeEmail = (value) => {
    setEmail(value);
  };

  const handleOnchangePassword = (value) => {
    setPassword(value);
  };

  const handleSignIn = () => {
    if (!email || !password) {
      console.log('Email hoặc mật khẩu chưa nhập');
      return;
    }

    console.log('sign-in', email, password);
    mutation.mutate({
      email: email,
      password: password
    });
  };

  

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 0, 0, 0.53)', height: '100vh' }}>
      <div style={{ width: '800px', height: '445px', borderRadius: '6px', background: '#fff', display: 'flex' }}>
        <WrapperContainerLeft>
          <h1>Xin chào</h1>
          <p>Đăng nhập và tạo tài khoản </p>
          <InputForm style={{ marginBottom: '10px' }} placeholder="@gmail.com" value={email} onChange={handleOnchangeEmail} />

          <div style={{ position: 'relative' }}>
            <span
              onClick={() => setIsShowPassword(!isShowPassword)}
              style={{
                zIndex: 10,
                position: 'absolute',
                top: '4px',
                right: '8px'
              }}
            >
              {isShowPassword ? (
                <EyeFilled />
              ) : (
                <EyeInvisibleFilled />
              )}
            </span>
            <InputForm placeholder="password" type={isShowPassword ? "text" : "password"} value={password} onChange={handleOnchangePassword} />
          </div>
          {data?.status == 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
          <Loading isPending={mutation.isPending}>
          <ButtonComponent
            disabled={!email.length || !password.length}
            onClick={handleSignIn}
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
            pending={isPending} 
            textButton={'Đăng nhập'}
            styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
          />
          </Loading>
          
          <p><WrapperTextLight>Quên mật khẩu</WrapperTextLight></p>
          <p>Chưa có tài khoản <WrapperTextLight onClick={handleNavigateSignUp}>Tạo tài khoản </WrapperTextLight></p>
        </WrapperContainerLeft>

        <WrapperContainerRight>
          <Image src={imageLogo} preview={false} alt="image-logo" />
          <h4>Mua sắm tại TechZone</h4>
        </WrapperContainerRight>
      </div>
    </div>
  );
};

export default SignInPage;
