import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AllProducts } from './pages/AllProducts/AllProducts';
import { ViewProductPage } from './pages/ViewProduct/ViewProduct';
import { TrpcProvider } from './lib/TrpcProvider';
import * as routes from './lib/routes';
import { Layout } from './components/Layout/Layout';
import './styles/global.scss';
import { CreateProductForm } from './pages/CreateProductForm/CreateProductForm';
import { SignUp } from './pages/SignUp/SignUp';
import { SignIn } from './pages/SignIn/SignIn';
import { SignOutPage } from './pages/SignOut/SignOut';

export const App = () => {
  return (
    <TrpcProvider>
      <BrowserRouter>
        <Routes>
          <Route path={routes.getSignOutRoute()} element={<SignOutPage />} />
          <Route element={<Layout />}>
            <Route path={routes.getSignUpRoute()} element={<SignUp />} />
            <Route path={routes.getSignInRoute()} element={<SignIn />} />
            <Route path={routes.getAllProductsRoute()} element={<AllProducts />} />
            <Route path={routes.getNewProductRoute()} element={<CreateProductForm />} />
            <Route path={routes.getViewProductPage(routes.viewProductRouteParams)} element={<ViewProductPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TrpcProvider>
  );
};
