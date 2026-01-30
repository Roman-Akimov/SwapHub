import { AllProducts } from './components/AllProductsPage'
import { TrpcProvider } from './lib/TrpcProvider'

export const App = () => {
  return (
    <TrpcProvider>
      <AllProducts />
    </TrpcProvider>
  )
}
