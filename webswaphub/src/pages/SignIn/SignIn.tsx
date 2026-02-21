import { useFormik } from 'formik';
import { withZodSchema } from 'formik-validator-zod';
import { useState } from 'react';
import { trpc } from '../../lib/trpc';
import { zSignInTrpcInput } from '@swaphub/backend/src/lib/router/signIn/signIn';
import { FormItems } from '../../components/FormItems/FormItems';
import { Input } from '../../components/Input/Input';
import { Alert } from '../../components/Alert/Alert';
import { Button } from '../../components/Button/Button';

type FormValues = {
  email: string;
  password: string;
};

export const SignIn = () => {
  const [successMessageVisible, setSuccessMessageVisible] = useState(false);
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
        await signIn.mutateAsync(values);
        formik.resetForm();
        setSuccessMessageVisible(true);
        setTimeout(() => {
          setSuccessMessageVisible(false);
        }, 3000);
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
          {successMessageVisible && <Alert color="green">С возвращением!</Alert>}
          <Button loading={formik.isSubmitting}>Войти</Button>
        </FormItems>
      </form>
    </div>
  );
};
