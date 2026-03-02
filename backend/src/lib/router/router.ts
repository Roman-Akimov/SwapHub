import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { app } from '../trpc/trpc';
import { createProductTrpcRoute } from './createProduct/createProduct';
import { getMeTrpcRoute } from './getMe/getMe';
import { getProductTrpcRoute } from './getProduct/getProduct';
import { getProductsTrpcRoute } from './getProducts/getProducts';
import { signInTrpcRoute } from './signIn/signIn.endpoint';
import { signUpTrpcRoute } from './signUp/signUp.endpoint';
import { updateProductTrpcRoute } from './updateProduct/updateProduct.endpoint';

export const appRouter = app.router({
  getProduct: getProductTrpcRoute,
  getProducts: getProductsTrpcRoute,
  createProduct: createProductTrpcRoute,
  signUp: signUpTrpcRoute,
  signIn: signInTrpcRoute,
  getMe: getMeTrpcRoute,
  updateProduct: updateProductTrpcRoute,
});

export type AppRouter = typeof appRouter;
export type AppRouterInput = inferRouterInputs<AppRouter>;
export type AppRouterOutput = inferRouterOutputs<AppRouter>;
