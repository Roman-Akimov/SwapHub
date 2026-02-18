import { TRPCError } from '@trpc/server';
import { app } from '../../trpc/trpc';
import { GetProductByIdInputSchema } from '../../schemas/productSchemas';

export const getProductTrpcRoute = app.procedure.input(GetProductByIdInputSchema).query(async ({ ctx, input }) => {
  const product = await ctx.prisma.product.findUnique({
    where: {
      id: input.productId,
    },
  });

  if (!product) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `Товар с id=${input.productId} не найден`,
    });
  }

  return { product };
});
