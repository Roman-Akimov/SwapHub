import { initTRPC } from '@trpc/server';

const products = [
  {
    id: 1,
    name: 'Iphone',
    price: 70,
    currency: '$',
    image: 'https://avatars.mds.yandex.net/i?id=7165e767da4f62e966db16f3cd9ae01c568d1fbe-5266118-images-thumbs&n=13',
    description: 'Iphone 10',
  },
  {
    id: 2,
    name: 'Iphone',
    price: 80,
    currency: '$',

    image: 'https://avatars.mds.yandex.net/i?id=7165e767da4f62e966db16f3cd9ae01c568d1fbe-5266118-images-thumbs&n=13',
    description: 'Iphone 11',
  },
  {
    id: 3,
    name: 'Iphone',
    price: 90,
    currency: '$',
    image: 'https://avatars.mds.yandex.net/i?id=7165e767da4f62e966db16f3cd9ae01c568d1fbe-5266118-images-thumbs&n=13',
    description: 'Iphone 12',
  },
];

const app = initTRPC.create();

export const appRouter = app.router({
  getProducts: app.procedure.query(() => {
    return { products };
  }),
});

export type AppRouter = typeof appRouter;
