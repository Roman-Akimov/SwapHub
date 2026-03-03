import { z } from 'zod';
import { CreateProductInputSchema } from '../../../schemas/productSchemas';

export const zUpdateProductTrpcInput = CreateProductInputSchema.extend({
  productId: z.string().min(1),
});
