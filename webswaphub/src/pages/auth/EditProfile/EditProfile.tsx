import { z } from 'zod';
import { zUpdateProfileTrpcInput } from '@swaphub/backend/src/lib/router/auth/updateProfile/updateProfile';
import { zUpdatePasswordTrpcInput } from '@swaphub/backend/src/lib/router/auth/updatePassword/updatePassword';
import { useForm } from '../../../lib/form';
import { withPageWrapper } from '../../../lib/pageWrapper';
import { trpc } from '../../../lib/trpc';
import { Alert } from '../../../components/Alert/Alert';
import { Button } from '../../../components/Button/Button';
import { FormItems } from '../../../components/FormItems/FormItems';
import { Input } from '../../../components/Input/Input';
import { Segment } from '../../../components/Segment/Segment';
import type { AppRouterOutput } from '@swaphub/backend/src/lib/router/router';

// Компонент для основной информации
const General = ({ me }: { me: NonNullable<AppRouterOutput['getMe']['me']> }) => {
  const trpcUtils = trpc.useContext();
  const updateProfile = trpc.updateProfile.useMutation();

  const { formik, alertProps, buttonProps } = useForm({
    initialValues: {
      nickName: me.nickName,
      firstName: me.firstName,
      lastName: me.lastName,
      email: me.email,
    },
    validationSchema: zUpdateProfileTrpcInput,
    onSubmit: async (values) => {
      const result = await updateProfile.mutateAsync(values);
      trpcUtils.getMe.setData(undefined, { me: result.user });
    },
    successMessage: 'Profile updated',
    resetOnSuccess: false,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormItems>
        <Input label="Ник" name="nickName" formik={formik} />
        <Input label="Имя" name="firstName" formik={formik} />
        <Input label="Фамилия" name="lastName" formik={formik} />
        <Input label="Email" name="email" formik={formik} type="email" />
        <Alert {...alertProps} />
        <Button {...buttonProps}>Обновить профиль</Button>
      </FormItems>
    </form>
  );
};

// Компонент для смены пароля
const Password = () => {
  const updatePassword = trpc.updatePassword.useMutation();

  const { formik, alertProps, buttonProps } = useForm({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      newPasswordAgain: '',
    },
    validationSchema: zUpdatePasswordTrpcInput
      .extend({
        newPasswordAgain: z.string().min(1, 'Подтвердите пароль'),
      })
      .superRefine((val, ctx) => {
        if (val.newPassword !== val.newPasswordAgain) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Пароли должны совпадать',
            path: ['newPasswordAgain'],
          });
        }
      }),
    onSubmit: async ({ newPassword, oldPassword }) => {
      await updatePassword.mutateAsync({ newPassword, oldPassword });
    },
    successMessage: 'Пароль успешно изменен',
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormItems>
        <Input label="Старый пароль" name="oldPassword" type="password" formik={formik} />
        <Input label="Новый пароль" name="newPassword" type="password" formik={formik} />
        <Input label="Подтверждение пароля" name="newPasswordAgain" type="password" formik={formik} />
        <Alert {...alertProps} />
        <Button {...buttonProps}>Сменить пароль</Button>
      </FormItems>
    </form>
  );
};

export const EditProfilePage = withPageWrapper({
  authorizedOnly: true,
  setProps: ({ ctx }) => {
    return {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      me: ctx.me!,
    };
  },
})(({ me }: { me: NonNullable<AppRouterOutput['getMe']['me']> }) => {
  return (
    <Segment title="Редактирование профиля">
      <Segment title="Основная информация">
        <General me={me} />
      </Segment>

      <Segment title="Безопасность">
        <Password />
      </Segment>
    </Segment>
  );
});
