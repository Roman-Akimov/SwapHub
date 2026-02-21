import cn from 'classnames';
import { type FormikProps } from 'formik';
import css from './Input.module.scss';

export const Input = ({
  name,
  label,
  formik,
  maxWidth,
}: {
  name: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formik: FormikProps<any>;
  maxWidth?: number;
  type?: string;
}) => {
  const error = formik.errors[name] as string | undefined;
  const touched = formik.touched[name];
  const invalid = !!touched && !!error;
  const disabled = formik.isSubmitting;

  return (
    <div className={cn({ [css.field]: true, [css.disabled]: disabled })}>
      <label className={css.label} htmlFor={name}>
        {label}
      </label>
      <input
        className={cn({
          [css.input]: true,
          [css.invalid]: invalid,
        })}
        style={{ maxWidth }}
        type="text"
        onChange={(e) => {
          formik.setFieldValue(name, e.target.value);
        }}
        id={name}
        disabled={formik.isSubmitting}
      />
      {invalid && <div className={css.error}>{error}</div>}
    </div>
  );
};
