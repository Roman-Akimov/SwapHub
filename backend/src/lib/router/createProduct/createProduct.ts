// import type { Product } from '../../mock/products';
// import { generateProducts } from '../../mock/products';
import { TRPCError } from '@trpc/server';
import { CreateProductInputSchema } from '../../schemas/productSchemas';
import { app } from '../../trpc/trpc';

// export let products: Product[] = generateProducts(30);

export const createProductTrpcRoute = app.procedure.input(CreateProductInputSchema).mutation(async ({ input, ctx }) => {
  try {
    const newProduct = await ctx.prisma.product.create({
      data: {
        name: input.name,
        description: input.description,
        imageFile: input.image,
        price: input.price,
        currency: input.currency,
      },
    });
    return { product: newProduct };
  } catch (error) {
    console.error('Error creating product', error);

    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Ошибка при создании товара',
    });
  }

  // const newProduct = {
  //   id: products.length ? products[products.length - 1].id + 1 : 1,
  //   ...input,
  // };
  // products = [...products, newProduct];
});
