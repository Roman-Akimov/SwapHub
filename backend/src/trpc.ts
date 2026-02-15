import { initTRPC, TRPCError } from '@trpc/server';
import { generateProducts, Product } from './lib/mock/products';
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
let products: Product[] = generateProducts(30);

export const CreateProductInputSchema = z
  .object({
    name: z.string().trim().min(2),
    description: z.string().trim().min(15),
    currency: z.enum(['RUB', 'USD']),
    price: z.coerce.number().finite().positive(),
    image: z.string().url(),
  })
  .strict();

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

  createProduct: app.procedure.input(CreateProductInputSchema).mutation(({ input }) => {
    const newProduct = {
      id: products.length ? products[products.length - 1].id + 1 : 1,
      ...input,
    };

    products = [...products, newProduct];

    return { product: newProduct };
  }),
});

export type AppRouter = typeof appRouter;
