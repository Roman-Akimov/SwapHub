import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config();
import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter } from './trpc';
import cors from 'cors';
import { AppContext, createAppContext } from './lib/ctx';

console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ установлен' : '❌ НЕ установлен');
console.log('DATABASE_URL starts with:', process.env.DATABASE_URL?.substring(0, 30));

void (async () => {
  let ctx: AppContext | null = null;
  try {
    ctx = createAppContext();
    const expressApp = express();
    expressApp.use(cors());
    expressApp.get('/ping', (req, res) => {
      res.send('pong');
    });

    expressApp.use(
      '/trpc',
      trpcExpress.createExpressMiddleware({
        router: appRouter,
        createContext: () => {
          return ctx!;
        },
      })
    );

    expressApp.listen(3000, () => {
      console.log('Listening at http://localhost:3000');
    });
  } catch (error) {
    console.error(error);
    await ctx?.stop();
  }
})();
