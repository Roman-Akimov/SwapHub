import { initTRPC, TRPCError } from '@trpc/server';
import { generateProducts } from './lib/mock/products';
import { z } from 'zod';

// const products = [
//   {
//     id: 1,
//     name: 'Iphone 10',
//     price: 70,
//     currency: '$',
//     image: 'https://avatars.mds.yandex.net/i?id=7165e767da4f62e966db16f3cd9ae01c568d1fbe-5266118-images-thumbs&n=13',
//     description: 'Iphone 10 Buy here!!',
//   },
//   {
//     id: 2,
//     name: 'Iphone 15',
//     price: 80,
//     currency: '$',

//     image: 'https://avatars.mds.yandex.net/i?id=7165e767da4f62e966db16f3cd9ae01c568d1fbe-5266118-images-thumbs&n=13',
//     description: 'Iphone 15 Buy here!!',
//   },
//   {
//     id: 3,
//     name: 'Iphone 18',
//     price: 90,
//     currency: '$',
//     image: 'https://avatars.mds.yandex.net/i?id=7165e767da4f62e966db16f3cd9ae01c568d1fbe-5266118-images-thumbs&n=13',
//     description: 'Iphone 18 Buy here!!',
//   },
// ];

const app = initTRPC.create();
const products = generateProducts(30);

export const GetProductByIdInputSchema = z
  .object({
    productId: z.coerce.number().int().positive(),
  })
  .strict();

export const appRouter = app.router({
  getProducts: app.procedure.query(() => {
    return { products };
  }),
  getProduct: app.procedure.input(GetProductByIdInputSchema).query(({ input }) => {
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
  }),
});

export type AppRouter = typeof appRouter;
