import { zUpdateProfileTrpcInput } from '@swaphub/backend/src/lib/router/auth/updateProfile/updateProfile';
import { useForm } from '../../../lib/form';
import { withPageWrapper } from '../../../lib/pageWrapper';
import { trpc } from '../../../lib/trpc';
import { Alert } from '../../../components/Alert/Alert';
import { Button } from '../../../components/Button/Button';
import { FormItems } from '../../../components/FormItems/FormItems';
import { Input } from '../../../components/Input/Input';
import { Segment } from '../../../components/Segment/Segment';
import type { AppRouterOutput } from '@swaphub/backend/src/lib/router/router';

type EditProfileProps = {
  me: NonNullable<AppRouterOutput['getMe']['me']>;
};

export const EditProfilePage = withPageWrapper({
  authorizedOnly: true,
  setProps: ({ getAuthorizedMe }) => {
    return {
      me: getAuthorizedMe(),
    };
  },
})(({ me }: EditProfileProps) => {
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
      const updatedUser = await updateProfile.mutateAsync(values);
      trpcUtils.getMe.setData(undefined, { me: updatedUser.user });
    },
    successMessage: 'Данные применены',
    resetOnSuccess: false,
  });

  return (
    <Segment title="Редактирование профиля">
      <form onSubmit={formik.handleSubmit}>
        <FormItems>
          <Input label="Ник" name="nickName" formik={formik} />
          <Input label="Имя" name="firstName" formik={formik} />
          <Input label="Фамилия" name="lastName" formik={formik} />
          <Input label="Email" name="email" formik={formik} type="email" />
          <Alert {...alertProps} />
          <Button {...buttonProps}>Обновить</Button>
        </FormItems>
      </form>
    </Segment>
  );
});
