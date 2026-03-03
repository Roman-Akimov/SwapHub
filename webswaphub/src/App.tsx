import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AllProducts } from './pages/products/AllProducts/AllProducts';
import { TrpcProvider } from './lib/TrpcProvider';
import * as routes from './lib/routes';
import { Layout } from './components/Layout/Layout';
import './styles/global.scss';
import { CreateProductForm } from './pages/products/CreateProductForm/CreateProductForm';
import { SignUp } from './pages/auth/SignUp/SignUp';
import { SignIn } from './pages/auth/SignIn/SignIn';
import { SignOutPage } from './pages/auth/SignOut/SignOut';
import { EditProduct } from './pages/products/EditProduct/EditProduct';
import { AppContextProvider } from './lib/ctx';
import { NotFoundPage } from './pages/other/NotFoundPage/NotFoundPage';
import { ViewProductPage } from './pages/products/ViewProduct/ViewProduct';

export const App = () => {
  return (
    <TrpcProvider>
      <AppContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path={routes.getSignOutRoute()} element={<SignOutPage />} />
            <Route element={<Layout />}>
              <Route path={routes.getSignUpRoute()} element={<SignUp />} />
              <Route path={routes.getSignInRoute()} element={<SignIn />} />
              <Route path={routes.getAllProductsRoute()} element={<AllProducts />} />
              <Route path={routes.getNewProductRoute()} element={<CreateProductForm />} />
              <Route path={routes.getViewProductPage(routes.viewProductRouteParams)} element={<ViewProductPage />} />
              <Route path={routes.getEditProductPage(routes.editProductRouteParams)} element={<EditProduct />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppContextProvider>
    </TrpcProvider>
  );
};
