import { type FormikHelpers, useFormik, type FormikConfig } from 'formik';
import { withZodSchema } from 'formik-validator-zod';
import { useMemo, useState } from 'react';
import { type z } from 'zod';
import type { AlertProps } from '../components/Alert/Alert';
import type { ButtonProps } from '../components/Button/Button';

export const useForm = <
  TZodSchema extends z.ZodTypeAny,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TValues extends Record<string, any>,
>({
  successMessage = false,
  resetOnSuccess = true,
  showValidationAlert = false,
  initialValues,
  validationSchema,
  onSubmit,
}: {
  successMessage?: string | false;
  resetOnSuccess?: boolean;
  showValidationAlert?: boolean;
  initialValues: TValues;
  validationSchema?: TZodSchema;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (values: TValues, actions: FormikHelpers<TValues>) => Promise<any> | any;
}) => {
  const [successMessageVisible, setSuccessMessageVisible] = useState(false);
  const [submittingError, setSubmittingError] = useState<Error | null>(null);

  const formikConfig: FormikConfig<TValues> = {
    initialValues,
    onSubmit: async (values, formikHelpers) => {
      try {
        setSubmittingError(null);
        await onSubmit(values, formikHelpers);
        if (resetOnSuccess) {
          formik.resetForm();
        }
        setSuccessMessageVisible(true);
        setTimeout(() => {
          setSuccessMessageVisible(false);
        }, 3000);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setSubmittingError(error);
      }
    },
  };

  // Добавляем валидацию, если она есть
  if (validationSchema) {
    formikConfig.validate = withZodSchema(validationSchema);
  }

  const formik = useFormik<TValues>(formikConfig);

  const alertProps = useMemo<AlertProps>(() => {
    if (submittingError) {
      return {
        hidden: false,
        children: submittingError.message,
        color: 'red',
      };
    }
    if (showValidationAlert && !formik.isValid && !!formik.submitCount) {
      return {
        hidden: false,
        children: 'Some fields are invalid',
        color: 'red',
      };
    }
    if (successMessageVisible && successMessage) {
      return {
        hidden: false,
        children: successMessage,
        color: 'green',
      };
    }
    return {
      color: 'red',
      hidden: true,
      children: null,
    };
  }, [submittingError, formik.isValid, formik.submitCount, successMessageVisible, successMessage, showValidationAlert]);

  const buttonProps = useMemo<Omit<ButtonProps, 'children'>>(() => {
    return {
      loading: formik.isSubmitting,
    };
  }, [formik.isSubmitting]);

  return {
    formik,
    alertProps,
    buttonProps,
  };
};
