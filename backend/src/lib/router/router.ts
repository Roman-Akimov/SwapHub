import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { app } from '../trpc/trpc';
import { getProductsTrpcRoute } from './products/getProducts/getProducts';
import { createProductTrpcRoute } from './products/createProduct/createProduct';
import { getMeTrpcRoute } from './auth/getMe/getMe';
import { signInTrpcRoute } from './auth/signIn/signIn.endpoint';
import { signUpTrpcRoute } from './auth/signUp/signUp.endpoint';
import { updateProductTrpcRoute } from './products/updateProduct/updateProduct.endpoint';
import { updateProfileTrpcRoute } from './auth/updateProfile/updateProfile.endpoint';
import { updatePasswordTrpcRoute } from './auth/updatePassword/updatePassword.endpoint';
import { getProductTrpcRoute } from './products/getProduct/getProduct';

export const appRouter = app.router({
  getProduct: getProductTrpcRoute,
  getProducts: getProductsTrpcRoute,
  createProduct: createProductTrpcRoute,
  signUp: signUpTrpcRoute,
  signIn: signInTrpcRoute,
  getMe: getMeTrpcRoute,
  updateProduct: updateProductTrpcRoute,
  updateProfile: updateProfileTrpcRoute,
  updatePassword: updatePasswordTrpcRoute,
});

export type AppRouter = typeof appRouter;
export type AppRouterInput = inferRouterInputs<AppRouter>;
export type AppRouterOutput = inferRouterOutputs<AppRouter>;
