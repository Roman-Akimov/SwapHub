import { getViewProductPage } from '../../lib/routes';
import { trpc } from '../../lib/trpc';
import { Link } from 'react-router-dom';

export const AllProducts = () => {
  const { data, error, isLoading, isFetching, isError } = trpc.getProducts.useQuery();

  if (isLoading || isFetching) {
    return <div>Загрузка товаров...</div>;
  }

  if (isError) {
    return <div>Ошибка: {error.message}</div>;
  }

  if (!data || !data.products) {
    return <div>Нет доступных товаров</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Все товары</h1>

      <div style={{ display: 'grid', gap: '16px', marginTop: '20px' }}>
        {data.products.map((product) => {
          return (
            <Link
              key={product.id}
              to={getViewProductPage({ productId: String(product.id) })}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'block',
                border: '1px solid #ccc',
                padding: '16px',
                borderRadius: '8px',
                background: '#f9f9f9',
              }}
            >
              <div>
                <h2>{product.name}</h2>
                <p>
                  Price: {product.price} {product.currency}
                </p>
                {product.imageFile && <img src={product.imageFile} alt={product.name} width={80} />}
                <p>{product.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
