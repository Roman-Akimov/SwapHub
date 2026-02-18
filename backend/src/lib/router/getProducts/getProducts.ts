import { app } from '../../trpc/trpc';

export const getProductsTrpcRoute = app.procedure.query(async ({ ctx }) => {
  const products = await ctx.prisma.product.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      currency: true,
      imageFile: true,
      createdAt: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return {products};
});
