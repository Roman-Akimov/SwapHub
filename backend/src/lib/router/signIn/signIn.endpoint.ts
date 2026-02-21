import { getPasswordHash } from '../../../utils/getPasswordHash';
import { app } from '../../trpc/trpc';
import { zSignInTrpcInput } from './signIn';

export const signInTrpcRoute = app.procedure.input(zSignInTrpcInput).mutation(async ({ ctx, input }) => {
  const user = await ctx.prisma.user.findFirst({
    where: {
      email: input.email,
      password: getPasswordHash(input.password),
    },
  });

  if (!user) {
    throw new Error('Неверный email или пароль');
  }

  return true;
});
