import _ from 'lodash';
import { app } from '../../../lib/trpc/trpc';

export const getMeTrpcRoute = app.procedure.query(({ ctx }) => {
  return { me: ctx.me && _.pick(ctx.me, ['id', 'nickName']) };
});
