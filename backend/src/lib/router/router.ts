import { app } from '../trpc/trpc';
import { createProductTrpcRoute } from './createProduct/createProduct';
import { getMeTrpcRoute } from './getMe/getMe';
import { getProductTrpcRoute } from './getProduct/getProduct';
import { getProductsTrpcRoute } from './getProducts/getProducts';
import { signInTrpcRoute } from './signIn/signIn.endpoint';
import { signUpTrpcRoute } from './signUp/signUp.endpoint';

export const appRouter = app.router({
  getProduct: getProductTrpcRoute,
  getProducts: getProductsTrpcRoute,
  createProduct: createProductTrpcRoute,
  signUp: signUpTrpcRoute,
  signIn: signInTrpcRoute,
  getMe: getMeTrpcRoute,
});

export type AppRouter = typeof appRouter;
