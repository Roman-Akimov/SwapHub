import { useNavigate, useParams } from 'react-router-dom';
import { getViewProductPage, type EditProductRouteParams } from '../../lib/routes';
import { trpc } from '../../lib/trpc';
import type { AppRouterOutput } from '@swaphub/backend/src/lib/router/router';
import { useState } from 'react';
import { useFormik } from 'formik';
import { zUpdateProductTrpcInput } from '@swaphub/backend/src/lib/router/updateProduct/updateProduct';
import { toFormikValidationSchema } from 'zod-formik-adapter';

import css from './EditProduct.module.scss';
import { FormItems } from '../../components/FormItems/FormItems';
import { Input } from '../../components/Input/Input';
import { Button } from '../../components/Button/Button';
import { Alert } from '../../components/Alert/Alert';

const EditProductComponent: React.FC<{ product: NonNullable<AppRouterOutput['getProduct']['product']> }> = ({
  product,
}) => {
  const navigate = useNavigate();
  const [submittingError, setSubmittingError] = useState<string | null>(null);
  const updateProduct = trpc.updateProduct.useMutation();

  const formSchema = zUpdateProductTrpcInput.omit({ productId: true });

  const formik = useFormik({
    initialValues: {
      name: product.name,
      description: product.description,
      image: product.imageFile,
      price: product.price,
      currency: product.currency,
    },
    validationSchema: toFormikValidationSchema(formSchema),
    onSubmit: async (values) => {
      try {
        setSubmittingError(null);

        const success = await updateProduct.mutateAsync({
          productId: product.id,
          name: values.name,
          description: values.description,
          image: values.image,
          price: values.price,
          currency: values.currency,
        });

        if (success) {
          navigate(getViewProductPage({ productId: product.id }));
        } else {
          setSubmittingError('Не удалось обновить товар');
        }
      } catch (error) {
        setSubmittingError(error instanceof Error ? error.message : 'Неизвестная ошибка');
      }
    },
  });

  return (
    <div className={css.container}>
      <h1 className={css.title}>Редактирование товара: {product.name}</h1>

      <form onSubmit={formik.handleSubmit}>
        <FormItems>
          {/* Название товара */}
          <div className={css.field}>
            <div className={css.label}>Введите название товара:</div>
            <Input name="name" label="" formik={formik} />
          </div>

          {/* Превью изображения - как в окне создания */}
          <div className={css.previewSection}>
            <div className={css.previewTitle}>Превью изображения</div>
            {formik.values.image ? (
              <div className={css.previewContainer}>
                <img src={formik.values.image} alt="Превью товара" className={css.previewImage} />
                <button
                  type="button"
                  onClick={() => {
                    return formik.setFieldValue('image', '');
                  }}
                  className={css.clearButton}
                >
                  Очистить
                </button>
              </div>
            ) : (
              <div className={css.previewContainer}>
                <div className={css.noImage}>- Добавьте изображение</div>
              </div>
            )}
          </div>

          {/* Описание товара */}
          <div className={css.field}>
            <div className={css.label}>Опишите свой товар:</div>
            <div className={css.descriptionLabel}>Описание</div>
            <textarea
              id="description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={formik.isSubmitting}
              rows={5}
              className={`${css.textarea} ${formik.touched.description && formik.errors.description ? css.invalid : ''}`}
              placeholder="Введите описание товара..."
            />
            {formik.touched.description && formik.errors.description && (
              <div className={css.error}>{formik.errors.description}</div>
            )}
          </div>

          {/* Цена и валюта в одной строке как в окне создания */}
          <div className={css.priceRow}>
            <div className={css.priceField}>
              <div className={css.label}>Укажите цену:</div>
              <Input name="price" label="" formik={formik} />
            </div>

            <div className={css.currencyField}>
              <div className={css.label}>Укажите валюту:</div>
              <div className={css.currencySelect}>
                <select
                  id="currency"
                  name="currency"
                  value={formik.values.currency}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={formik.isSubmitting}
                  className={`${css.select} ${formik.touched.currency && formik.errors.currency ? css.invalid : ''}`}
                >
                  <option value="RUB">RUB ▼</option>
                  <option value="USD">USD ▼</option>
                </select>
              </div>
            </div>
          </div>

          {/* Скрытое поле URL изображения (не показываем, так как есть превью) */}
          <input type="hidden" name="image" value={formik.values.image} />

          {/* Кнопка отправки */}
          <div className={css.submitContainer}>
            <Button loading={formik.isSubmitting}>Сохранить изменения</Button>

            <button
              type="button"
              onClick={() => {
                return navigate(getViewProductPage({ productId: product.id }));
              }}
              disabled={formik.isSubmitting}
              className={css.cancelButton}
            >
              Отмена
            </button>
          </div>

          {/* Ошибка отправки */}
          {submittingError && <Alert color="red">Ошибка: {submittingError}</Alert>}
        </FormItems>
      </form>
    </div>
  );
};

export const EditProductPage = () => {
  const { productId } = useParams() as EditProductRouteParams;

  const getProductResult = trpc.getProduct.useQuery({ productId });
  const getMeResult = trpc.getMe.useQuery();

  if (getProductResult.isLoading || getProductResult.isFetching || getMeResult.isLoading || getMeResult.isFetching) {
    return <span className={css.loading}>Загрузка...</span>;
  }

  if (getProductResult.isError) {
    return <Alert color="red">Ошибка: {getProductResult.error?.message}</Alert>;
  }

  if (getMeResult.isError) {
    return <Alert color="red">Ошибка: {getMeResult.error?.message}</Alert>;
  }

  if (!getProductResult.data?.product) {
    return <Alert color="red">Товар не найден</Alert>;
  }

  const product = getProductResult.data.product;
  const me = getMeResult.data?.me;

  if (!me) {
    return <Alert color="red">Только для авторизованных пользователей</Alert>;
  }

  if (me.id !== product.ownerId) {
    return <Alert color="red">Товар может быть редактирован только автором</Alert>;
  }

  return <EditProductComponent product={product} />;
};
