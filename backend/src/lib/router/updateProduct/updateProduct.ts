import { CreateProductInputSchema } from '../../schemas/productSchemas';
import { z } from 'zod';

export const zUpdateProductTrpcInput = CreateProductInputSchema.extend({
  productId: z.string().min(1),
});
