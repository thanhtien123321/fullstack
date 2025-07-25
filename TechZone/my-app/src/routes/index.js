import HomePage from "../pages/HomePage/HomePage";
import OrderPage from "../pages/OrderPage/OrderPage";
import ProductsPage from "../pages/ProductsPage/ProductsPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import TypeProductPage from "../pages/TypeProductPage/TypeProductPage";
import SignInPage from "../pages/SignInPage/SignInPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import ProductDetailsPage from "../pages/ProductDetailsPage/ProductDetailsPage";
import ProfilePage from "../pages/Profile/ProfilePage"
import AdminPage from '../pages/AdminPage/AdminPage';
import PaymentPage from '../pages/PaymentPage/PaymentPage'
export const routes = [
    {
      path: '/',
      page: HomePage,
      isShowHeader: true,
    },
    {
      path: '/order',
      page: OrderPage,
      isShowHeader: true,
    },
    {
      path: '/products',
      page: ProductsPage,
      isShowHeader: true,
    },
    {
      path: '/type/:type', // ✅ chỉnh lại
      page: TypeProductPage,
      isShowHeader: true,
    },
    {
      path: '/product-details/:id',
      page: ProductDetailsPage,
      isShowHeader: true,
    },
    {
      path: '/profile-user',
      page: ProfilePage,
      isShowHeader: true,
    },
    {
      path: '/system/admin',
      page: AdminPage,
      isShowHeader: false,
      isPrivate: true,
    },
    {
      path: '/sign-in',
      page: SignInPage,
      isShowHeader: false,
    },
    {
      path: '/sign-up',
      page: SignUpPage,
      isShowHeader: false,
    },
    {
      path: '/payment',
      page: PaymentPage,
      isShowHeader: false,
    },
    {
      path: '*',
      page: NotFoundPage,
      isShowHeader: true,
    },
  ];
  