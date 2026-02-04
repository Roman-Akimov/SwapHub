import { getViewProductPage } from '../../lib/routes';
import { trpc } from '../../lib/trpc';
import { Link } from 'react-router-dom';

export const AllProducts = () => {
  const { data, error, isLoading, isFetching, isError } = trpc.getProducts.useQuery();

  if (isLoading || isFetching) {
    return <div>Loading products...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  if (!data || !data.products) {
    return <div>No products available</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Swap Hub</h1>
      <h2>All Products</h2>

      <div style={{ display: 'grid', gap: '16px', marginTop: '20px' }}>
        {data.products.map((product) => {
          return (
            <Link
              key={product.id}
              to={getViewProductPage({ productName: product.name })}
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
                {product.image && <img src={product.image} alt={product.name} width={80} />}
                <p>{product.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
