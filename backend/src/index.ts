import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config();
import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter } from './trpc';
import cors from 'cors';
import { AppContext, createAppContext } from './lib/ctx';
import { applyPassportToExpressApp } from './lib/passport';
import { createTrpcContext } from './lib/trpc/trpc';
import { env } from './lib/env';

void (async () => {
  let ctx: AppContext | null = null;
  try {
    ctx = createAppContext();
    const expressApp = express();
    expressApp.use(cors());
    expressApp.get('/ping', (req, res) => {
      res.send('pong');
    });

    applyPassportToExpressApp(expressApp, ctx);

    const trpcContext = createTrpcContext(ctx);

    expressApp.use(
      '/trpc',
      trpcExpress.createExpressMiddleware({
        router: appRouter,
        createContext: trpcContext,
      })
    );

    expressApp.listen(3000, () => {
      console.log(`Listening at http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error(error);
    await ctx?.stop();
  }
})();
