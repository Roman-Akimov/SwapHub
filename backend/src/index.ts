import express from 'express';
import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter } from './trpc';
import cors from 'cors';

const expressApp = express();
expressApp.use(cors());
expressApp.get('/ping', (req, res) => {
  res.send('pong');
});

expressApp.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
  })
);

expressApp.listen(3000, () => {
  console.log('Listening at http://localhost:3000');
});
