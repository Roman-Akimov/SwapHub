import { TRPCError } from '@trpc/server';
import { GetProductByIdInputSchema } from '../../../schemas/productSchemas';
import { app } from '../../../trpc/trpc';

export const getProductTrpcRoute = app.procedure.input(GetProductByIdInputSchema).query(async ({ ctx, input }) => {
  const product = await ctx.prisma.product.findUnique({
    where: {
      id: input.productId,
    },
    include: {
      owner: {
        select: {
          id: true,
          nickName: true,
          firstName: true,
          lastName: true,
        },
      },
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
