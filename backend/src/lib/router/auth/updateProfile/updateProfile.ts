import { z } from 'zod';

export const zUpdateProfileTrpcInput = z.object({
  firstName: z.string().min(1, 'Имя обязательно'),
  lastName: z.string().min(1, 'Фамилия обязательна'),
  nickName: z.string().min(5, 'Ник должен содержать минимум 3 символа'),
  email: z.string().email('Некорректный email'),
});

export type UpdateProfileTrpcInput = z.infer<typeof zUpdateProfileTrpcInput>;
