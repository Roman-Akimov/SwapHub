import { app } from '../../trpc/trpc';
import { products } from '../createProduct/createProduct';

export const getProductsTrpcRoute = app.procedure.query(() => {
  return { products };
});
