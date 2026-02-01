import type { Product } from '../../types/product.type';

export const ProductCard = (props: Product) => {
  const { product } = props;

  return (
    <div className="products-view">
      <h2>{product.name}</h2>
      <p>
        {product.price}
        {product.currency}
      </p>
      <img src={product.image} alt={product.name} width={80} />
      <p>{product.description}</p>
    </div>
  );
};
