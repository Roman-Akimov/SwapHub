import { app } from '../../trpc/trpc';
import { zUpdateProductTrpcInput } from './updateProduct';

export const updateProductTrpcRoute = app.procedure.input(zUpdateProductTrpcInput).mutation(async ({ input, ctx }) => {
  const { productId, ...productInput } = input;
  if (!ctx.me) {
    throw new Error('UNAUTHORIZED');
  }

  const product = await ctx.prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    throw new Error('NOT_FOUND');
  }

  if (ctx.me.id !== product.ownerId) {
    throw new Error('NOT_YOUR_PRODUCT');
  }

  await ctx.prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      name: productInput.name,
      description: productInput.description,
      price: productInput.price,
      currency: productInput.currency,
      imageFile: productInput.image,
    },
  });
  return true;
});
