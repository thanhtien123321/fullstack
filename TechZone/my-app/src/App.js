import React, { Fragment, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { routes } from './routes';
import DefaultComponent from './components/DefaultComponent/DefaultComponent';
import * as UserService from './services/UserService';
import { updateUser, resetUser } from './redux/slides/userSlide';

function App() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector((state) => state.user);
 // 👈 Check log này

  

  useEffect(() => {
    const { token, decoded } = handleDecoded();

    if (decoded?.id) {
      handleGetDetailsUser(decoded.id, token);
    } else {
      dispatch(resetUser());
      setIsLoading(false);
    }
  }, []);

  const handleDecoded = () => {
    const token = localStorage.getItem('access_token');
    let decoded = {};
    try {
      if (token) decoded = jwtDecode(token);
    } catch (error) {
      console.error('Token lỗi hoặc hết hạn:', error);
      localStorage.removeItem('access_token');
    }
    return { token, decoded };
  };

  const handleGetDetailsUser = async (id, token) => {
    try {
      const res = await UserService.getDetailsUser(id, token);
      dispatch(updateUser({ ...res?.data, access_token: token }));
    } catch (error) {
      localStorage.removeItem('access_token');
      dispatch(resetUser());
    } finally {
      setIsLoading(false);
    }
  };

  // Interceptor tự động refresh token
  UserService.axiosJWT.interceptors.request.use(
    async (config) => {
      const { decoded } = handleDecoded();
      const currentTime = Date.now() / 1000;

      if (decoded?.exp < currentTime) {
        try {
          const data = await UserService.refreshToken();
          localStorage.setItem('access_token', data?.access_token)
          config.headers['Authorization'] = `Bearer ${data?.access_token}`;
        } catch (err) {
          dispatch(resetUser());
        }
      }
      return config;
    },
    (err) => Promise.reject(err)
  );

  const Loading = ({ isLoading, children }) => {
    if (isLoading) return <div>Loading...</div>;
    return <>{children}</>;
  };

  return (
    <div>
      <Loading isLoading={isLoading}>
        <Router>
          <Routes>
            {routes.map((route) => {
              const Page = route.page;
              const isCheckAuth = !route.isPrivate || user?.isAdmin;
              const Layout = route.isShowHeader ? DefaultComponent : Fragment;

              if (!isCheckAuth) return null;

              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            })}
          </Routes>
        </Router>
      </Loading>
    </div>
  );
}

export default App;
