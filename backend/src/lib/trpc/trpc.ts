import { initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import superjson from 'superjson';
import { type ExpressRequest } from '../../utils/types';
import { type AppContext } from './../ctx';

export const createTrpcContext = (appContext: AppContext) => {
  return ({ req }: trpcExpress.CreateExpressContextOptions) => {
    return {
      ...appContext,
      me: (req as ExpressRequest).user || null,
    };
  };
};

export type TrpcContext = Awaited<ReturnType<ReturnType<typeof createTrpcContext>>>;

export const app = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});
