import { initTRPC } from '@trpc/server';
import type { AppContext } from '../ctx';

export const app = initTRPC.context<AppContext>().create();
