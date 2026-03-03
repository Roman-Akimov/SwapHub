import { TRPCError } from '@trpc/server';
import { zSignUpTrpcInput } from './signUp';
import crypto from 'crypto';
import { env } from 'process';
import { signJWT } from '../../../../utils/signJWT';
import { app } from '../../../trpc/trpc';

export const signUpTrpcRoute = app.procedure.input(zSignUpTrpcInput).mutation(async ({ ctx, input }) => {
  const exUser = await ctx.prisma.user.findFirst({
    where: {
      OR: [{ email: input.email }, { nickName: input.nickName }],
    },
  });

  if (exUser) {
    if (exUser.email === input.email) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Email уже используется',
      });
    }
    if (exUser.nickName === input.nickName) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Никнейм уже занят',
      });
    }
  }

  const user = await ctx.prisma.user.create({
    data: {
      email: input.email,
      nickName: input.nickName,
      password: crypto.createHash('sha256').update(`${env.PASSWORD_SALT}${input.password}`).digest('hex'),
      firstName: input.firstName,
      lastName: input.lastName,
    },
  });

  const token = signJWT(user.id);

  return { token };
});
