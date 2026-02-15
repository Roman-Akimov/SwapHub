import { z } from 'zod';

export const CreateProductInputSchema = z
  .object({
    name: z.string().trim().min(2),
    description: z.string().trim().min(15),
    currency: z.enum(['RUB', 'USD']),
    price: z.coerce.number().finite().positive(),
    image: z.string().url(),
  })
  .strict();

export const GetProductByIdInputSchema = z
  .object({
    productId: z.coerce.number().int().positive(),
  })
  .strict();
