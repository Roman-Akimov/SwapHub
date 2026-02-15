import type { Product } from '../../mock/products';
import { generateProducts } from '../../mock/products';
import { CreateProductInputSchema } from '../../schemas/productSchemas';
import { app } from '../../trpc/trpc';

export let products: Product[] = generateProducts(30);

export const createProductTrpcRoute = app.procedure.input(CreateProductInputSchema).mutation(({ input }) => {
  const newProduct = {
    id: products.length ? products[products.length - 1].id + 1 : 1,
    ...input,
  };

  products = [...products, newProduct];

  return { product: newProduct };
});
