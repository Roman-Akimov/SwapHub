import { useParams } from 'react-router-dom';
import { type ViewProductRouteParams } from '../../lib/routes';
import { trpc } from '../../lib/trpc';

export const ViewProductPage = () => {
  const { productId } = useParams() as ViewProductRouteParams;

  const { data, isLoading, isError, error } = trpc.getProduct.useQuery({ productId }, { enabled: !!productId });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    if (error.data?.code === 'BAD_REQUEST') {
      // Если productId не число
      return <div>Invalid product id</div>;
    }
    if (error.data?.code === 'NOT_FOUND') {
      return <div>Product not found</div>;
    }
    return <div>Something went wrong: {error.message}</div>;
  }
  if (!data?.product) {
    return <div>Product not found</div>;
  }

  const { product } = data;

  return (
    <div style={{ padding: 20 }}>
      <h1>{product.name}</h1>
      <p>
        Price: {product.price} {product.currency}
      </p>
      <img src={product.image} alt={product.name} width={80} />
      <p>{product.description}</p>
    </div>
  );
};
