import { trpc } from '../../lib/trpc'
import { ProductCard } from '../ProductCard/ProductCard'
// /**
//  * (Дублирование) Убрать при завершении настройки базовой структуры
//  */
// type Product = {
//   id: number
//   name: string
//   price: number
//   currency: string
//   image: string
//   description: string
// }

export const AllProducts = () => {
  const { data, error, isLoading, isFetching, isError } = trpc.getProducts.useQuery()
  if (isLoading || isFetching) return <span>Loading...</span>
  if (isError) return <span>Error: {error.message}</span>
  if (!data) return <span>No data</span> // <-- важно для TS и на всякий случай

  return (
    <div>
      <h1>Swap Hub</h1>

      <div>
        {data.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
