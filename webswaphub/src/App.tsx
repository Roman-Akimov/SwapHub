import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AllProducts } from './components/AllProductsPage/AllProducts';
import { ViewProductPage } from './components/ViewProductPage/ViewProductPage';
import { TrpcProvider } from './lib/TrpcProvider';
import { getAllProductsPage, getViewProductPage, viewProductRouteParams } from './lib/routes';

export const App = () => {
  return (
    <TrpcProvider>
      <BrowserRouter>
        <Routes>
          <Route path={getAllProductsPage()} element={<AllProducts />} />
          <Route path={getViewProductPage(viewProductRouteParams)} element={<ViewProductPage />} />
        </Routes>
      </BrowserRouter>
    </TrpcProvider>
  );
};
