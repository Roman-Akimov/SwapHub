import { TRPCError } from '@trpc/server';
import { app } from '../../trpc/trpc';
import { zSignUpTrpcInput } from './signUp';
import crypto from 'crypto';

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

  await ctx.prisma.user.create({
    data: {
      email: input.email,
      nickName: input.nickName,
      password: crypto.createHash('sha256').update(input.password).digest('hex'),
      firstName: input.firstName,
      lastName: input.lastName,
    },
  });

  return true;
});
