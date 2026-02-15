export type FormState = {
  name: string;
  imageFile: File | null;
  description: string;
  price: string;
  currency: string;
};

export type FormError = Partial<Record<keyof FormState, string>>;
