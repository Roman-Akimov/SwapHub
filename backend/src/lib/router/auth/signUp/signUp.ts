import { z } from 'zod';

export const zSignUpTrpcInput = z.object({
  email: z.string().min(1, 'Email обязателен').email('Некорректный email'),

  nickName: z
    .string()
    .min(6, 'Ник должен быть не менее 6 символов')
    .max(30, 'Ник слишком длинный')
    .regex(/^[a-zA-Z0-9_]+$/, 'Ник может содержать только латинские буквы, цифры и нижнее подчеркивание'),

  password: z.string().min(6, 'Пароль должен быть не менее 6 символов'),

  firstName: z.string().min(1, 'Имя обязательно').max(50, 'Имя слишком длинное'),

  lastName: z.string().min(1, 'Фамилия обязательна').max(50, 'Фамилия слишком длинная'),
});
