import { initTRPC } from '@trpc/server';
import type { AppContext } from '../ctx';
import superjson from 'superjson'

export const app = initTRPC.context<AppContext>().create({
  transformer: superjson
});
