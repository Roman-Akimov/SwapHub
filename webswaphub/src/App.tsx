import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AllProducts } from './pages/AllProductsPage/AllProducts';
import { ViewProductPage } from './pages/ViewProductPage/ViewProduct';
import { TrpcProvider } from './lib/TrpcProvider';
import { getAllProductsPage, getViewProductPage, viewProductRouteParams } from './lib/routes';
import { Layout } from './components/layout/Layout';
import './styles/global.scss'

export const App = () => {
  return (
    <TrpcProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path={getAllProductsPage()} element={<AllProducts />} />
            <Route path={getViewProductPage(viewProductRouteParams)} element={<ViewProductPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TrpcProvider>
  );
};
