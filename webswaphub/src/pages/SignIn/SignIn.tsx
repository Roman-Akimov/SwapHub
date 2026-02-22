import { useFormik } from 'formik';
import { withZodSchema } from 'formik-validator-zod';
import { useState } from 'react';
import { trpc } from '../../lib/trpc';
import { zSignInTrpcInput } from '@swaphub/backend/src/lib/router/signIn/signIn';
import { FormItems } from '../../components/FormItems/FormItems';
import { Input } from '../../components/Input/Input';
import { Alert } from '../../components/Alert/Alert';
import { Button } from '../../components/Button/Button';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { getAllProductsRoute } from '../../lib/routes';

type FormValues = {
  email: string;
  password: string;
};

export const SignIn = () => {
  const navigate = useNavigate();
  const trpcUtils = trpc.useUtils();
  const [submittingError, setSubmittingError] = useState<string | null>(null);
  const signIn = trpc.signIn.useMutation();

  const formik = useFormik<FormValues>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: withZodSchema(zSignInTrpcInput) as unknown as (
      values: FormValues
    ) => Partial<Record<keyof FormValues, string>>,
    onSubmit: async (values) => {
      try {
        setSubmittingError(null);
        const { token } = await signIn.mutateAsync(values);
        Cookies.set('token', token, { expires: 9999 });
        await trpcUtils.getMe.invalidate();
        navigate(getAllProductsRoute());
      } catch (err) {
        setSubmittingError(err instanceof Error ? err.message : 'Unknown error');
      }
    },
  });

  return (
    <div>
      <h1>Вход</h1>
      <form onSubmit={formik.handleSubmit}>
        <FormItems>
          <Input label="Email" name="email" formik={formik} />
          <Input label="Пароль" name="password" type="password" formik={formik} />
          {!formik.isValid && !!formik.submitCount && <Alert color="red">Что-то пошло не так..</Alert>}
          {submittingError && <Alert color="red">{submittingError}</Alert>}
          <Button loading={formik.isSubmitting}>Войти</Button>
        </FormItems>
      </form>
    </div>
  );
};
