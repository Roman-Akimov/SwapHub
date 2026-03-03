import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { app } from '../trpc/trpc';
import { getProductTrpcRoute } from './products/getProduct/getProduct';
import { getProductsTrpcRoute } from './products/getProducts/getProducts';
import { createProductTrpcRoute } from './products/createProduct/createProduct';
import { getMeTrpcRoute } from './auth/getMe/getMe';
import { signInTrpcRoute } from './auth/signIn/signIn.endpoint';
import { signUpTrpcRoute } from './auth/signUp/signUp.endpoint';
import { updateProductTrpcRoute } from './products/updateProduct/updateProduct.endpoint';

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
