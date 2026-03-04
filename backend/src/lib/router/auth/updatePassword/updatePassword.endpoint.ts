import { getPasswordHash } from '../../../../utils/getPasswordHash';
import { app } from '../../../trpc/trpc';
import { zUpdatePasswordTrpcInput } from './updatePassword';

export const updatePasswordTrpcRoute = app.procedure
  .input(zUpdatePasswordTrpcInput)
  .mutation(async ({ ctx, input }) => {
    if (!ctx.me) {
      throw new Error('Авторизуйтесь!');
    }

    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.me.id },
      select: { password: true }, // Берем только пароль из БД
    });

    if (!user) {
      throw new Error('Пользователь не найден');
    }

    if (user.password !== getPasswordHash(input.oldPassword)) {
      throw new Error('Неверный старый пароль!');
    }

    await ctx.prisma.user.update({
      where: { id: ctx.me.id },
      data: {
        password: getPasswordHash(input.newPassword),
      },
    });

    return { success: true };
  });
