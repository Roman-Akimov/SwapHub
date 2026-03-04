import _ from 'lodash';
import { app } from '../../../trpc/trpc';
import { toClientMe } from '../../../models';

export const getMeTrpcRoute = app.procedure.query(({ ctx }) => {
  return { me: toClientMe(ctx.me) };
});
