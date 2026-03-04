import { app } from '../../../trpc/trpc';
import { zGetProductsTrpcInput } from './input';

export const getProductsTrpcRoute = app.procedure.input(zGetProductsTrpcInput).query(async ({ ctx, input }) => {
  const products = await ctx.prisma.product.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      currency: true,
      imageFile: true,
      createdAt: true,
      serialNumber: true,
    },
    orderBy: [
      {
        createdAt: 'desc',
      },
      {
        serialNumber: 'desc',
      },
    ],
    cursor: input.cursor ? { serialNumber: input.cursor } : undefined,
    take: input.limit + 1,
  });
  const newProduct = products[input.limit];
  const nextCursor = newProduct?.serialNumber;
  const productsExceptNext = products.slice(0, input.limit);

  return { products: productsExceptNext, nextCursor };
});
