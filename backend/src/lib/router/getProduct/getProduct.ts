import { TRPCError } from '@trpc/server';
import { app } from '../../trpc/trpc';
import { products } from '../createProduct/createProduct';
import { GetProductByIdInputSchema } from '../../schemas/productSchemas';

export const getProductTrpcRoute = app.procedure.input(GetProductByIdInputSchema).query(({ input }) => {
  const product = products.find((p) => {
    return p.id === input.productId;
  });

  if (!product) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `Товар с id=${input.productId} не найден`,
    });
  }
  return { product };
});
