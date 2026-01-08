import { ProductCard } from "./components/ProductCard/ProductCard";

/**
 * (Дублирование) Убрать при завершении настройки базовой структуры
 */
type Product = {
  id: number;
  name: string;
  price: number;
  currency: string;
  image: string;
  description: string;
};
 
export const App = () => {
  const products: Product[] = [
    {
      id: 1,
      name: "Iphone",
      price: 70,
      currency: "$",
      image:
        "https://avatars.mds.yandex.net/i?id=7165e767da4f62e966db16f3cd9ae01c568d1fbe-5266118-images-thumbs&n=13",
      description: "Iphone 10",
    },
    {
      id: 2,
      name: "Iphone",
      price: 80,
      currency: "$",
      
      
      image:
        "https://avatars.mds.yandex.net/i?id=7165e767da4f62e966db16f3cd9ae01c568d1fbe-5266118-images-thumbs&n=13",
      description: "Iphone 11",
    },
    {
      id: 3,
      name: "Iphone",
      price: 90,
      currency: "$",
      image:
        "https://avatars.mds.yandex.net/i?id=7165e767da4f62e966db16f3cd9ae01c568d1fbe-5266118-images-thumbs&n=13",
      description: "Iphone 12",
    },
  ];

  return (
    <div>
      <h1>Swap Hub</h1>
      
      <div>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
