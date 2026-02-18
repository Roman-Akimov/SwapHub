import { app } from '../trpc/trpc';
import { createProductTrpcRoute } from './createProduct/createProduct';
import { getProductTrpcRoute } from './getProduct/getProduct';
import { getProductsTrpcRoute } from './getProducts/getProducts';
import { signUpTrpcRoute } from './signUp/signUp.endpoint';

export const appRouter = app.router({
  getProduct: getProductTrpcRoute,
  getProducts: getProductsTrpcRoute,
  createProduct: createProductTrpcRoute,
  signUp: signUpTrpcRoute
});

export type AppRouter = typeof appRouter;
