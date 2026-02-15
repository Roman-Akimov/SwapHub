import { app } from '../trpc/trpc';
import { createProductTrpcRoute } from './createProduct/createProduct';
import { getProductTrpcRoute } from './getProduct/getProduct';
import { getProductsTrpcRoute } from './getProducts/getProducts';

export const appRouter = app.router({
  getProduct: getProductTrpcRoute,
  getProducts: getProductsTrpcRoute,
  createProduct: createProductTrpcRoute,
});

export type AppRouter = typeof appRouter;
