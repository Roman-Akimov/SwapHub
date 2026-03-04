import { toClientMe } from '../../../models';
import { app } from '../../../trpc/trpc';
import { zUpdateProfileTrpcInput } from './updateProfile';

export const updateProfileTrpcRoute = app.procedure.input(zUpdateProfileTrpcInput).mutation(async ({ ctx, input }) => {
  if (!ctx.me) {
    throw new Error('Авторизуйтесь');
  }

  const existingUserWithNick = await ctx.prisma.user.findFirst({
    where: {
      nickName: input.nickName,
      NOT: { id: ctx.me.id },
    },
  });

  if (existingUserWithNick) {
    throw new Error('Пользователь с таким ником уже есть!');
  }

  const updateUser = await ctx.prisma.user.update({
    where: {
      id: ctx.me?.id,
    },
    data: input,
  });
  return { user: toClientMe(updateUser) };
});
