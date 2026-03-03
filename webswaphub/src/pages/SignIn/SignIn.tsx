import { trpc } from '../../lib/trpc';
import { zSignInTrpcInput } from '@swaphub/backend/src/lib/router/signIn/signIn';
import { FormItems } from '../../components/FormItems/FormItems';
import { Input } from '../../components/Input/Input';
import { Alert } from '../../components/Alert/Alert';
import { Button } from '../../components/Button/Button';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { getAllProductsRoute } from '../../lib/routes';
import { useForm } from '../../lib/form';
import { withPageWrapper } from '../../lib/pageWrapper';

export const SignIn = withPageWrapper({
  redirectAuthorized: true,
})(() => {
  const navigate = useNavigate();
  const trpcUtils = trpc.useUtils();
  const signIn = trpc.signIn.useMutation();

  const { formik, buttonProps, alertProps } = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: zSignInTrpcInput,
    onSubmit: async (values: { email: string; password: string }) => {
      const { token } = await signIn.mutateAsync(values);
      Cookies.set('token', token, { expires: 9999 });
      await trpcUtils.getMe.invalidate();
      navigate(getAllProductsRoute());
    },
  });

  return (
    <div>
      <h1>Вход</h1>
      <form onSubmit={formik.handleSubmit}>
        <FormItems>
          <Input label="Email" name="email" formik={formik} />
          <Input label="Пароль" name="password" type="password" formik={formik} />
          <Alert {...alertProps} />
          <Button {...buttonProps}>Войти</Button>
        </FormItems>
      </form>
    </div>
  );
});
