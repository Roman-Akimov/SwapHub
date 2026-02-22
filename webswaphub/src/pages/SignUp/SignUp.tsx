import { useFormik } from 'formik';
import { Alert } from '../../components/Alert/Alert';
import { Button } from '../../components/Button/Button';
import { FormItems } from '../../components/FormItems/FormItems';
import { Input } from '../../components/Input/Input';
import { useState } from 'react';
import { trpc } from '../../lib/trpc';
import { zSignUpTrpcInput } from '@swaphub/backend/src/lib/router/signUp/signUp';
import { withZodSchema } from 'formik-validator-zod';
import { z } from 'zod';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { getAllProductsRoute } from '../../lib/routes';

// Тип для значений формы
type FormValues = {
  email: string;
  nickName: string;
  firstName: string;
  lastName: string;
  password: string;
  passwordAgain: string;
};

export const SignUp = () => {
  const navigate = useNavigate();
  const trpcUtils = trpc.useContext();
  const [submittingError, setSubmittingError] = useState<string | null>(null);
  const signUp = trpc.signUp.useMutation();

  const formik = useFormik<FormValues>({
    initialValues: {
      email: '',
      nickName: '',
      firstName: '',
      lastName: '',
      password: '',
      passwordAgain: '',
    },
    validate: withZodSchema(
      zSignUpTrpcInput
        .extend({
          passwordAgain: z.string().min(1, 'Пожалуйста, повторите свой пароль'),
        })
        .superRefine((val, ctx) => {
          if (val.password !== val.passwordAgain) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Пароль должен совпадать',
              path: ['passwordAgain'],
            });
          }
        })
    ) as unknown as (values: FormValues) => Partial<Record<keyof FormValues, string>>,
    onSubmit: async (values) => {
      try {
        setSubmittingError(null);
        const { token } = await signUp.mutateAsync(values);
        Cookies.set('token', token, { expires: 9999 });
        void trpcUtils.invalidate();
        navigate(getAllProductsRoute());
      } catch (err) {
        setSubmittingError(err instanceof Error ? err.message : 'Unknown error');
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormItems>
        <h1>Регистрация</h1>
        <Input label="Email" name="email" formik={formik} />
        <Input label="Придумайте Никнейм" name="nickName" formik={formik} />
        <Input label="Имя" name="firstName" formik={formik} />
        <Input label="Фамилия" name="lastName" formik={formik} />
        <Input label="Пароль" name="password" type="password" formik={formik} />
        <Input label="Повторите пароль" name="passwordAgain" type="password" formik={formik} />
        {!formik.isValid && !!formik.submitCount && <Alert color="red">Пожалуйста, заполните корректно все поля</Alert>}
        {submittingError && <Alert color="red">{submittingError}</Alert>}
        <Button loading={formik.isSubmitting}>Зарегистрироваться</Button>
      </FormItems>
    </form>
  );
};
