import { useNavigate, useParams } from 'react-router-dom';
import { getViewProductPage, type EditProductRouteParams } from '../../lib/routes';
import { trpc } from '../../lib/trpc';
import { zUpdateProductTrpcInput } from '@swaphub/backend/src/lib/router/updateProduct/updateProduct';
import css from './EditProduct.module.scss';
import { FormItems } from '../../components/FormItems/FormItems';
import { Input } from '../../components/Input/Input';
import { Button } from '../../components/Button/Button';
import { Alert } from '../../components/Alert/Alert';
import { useForm } from '../../lib/form';
import { withPageWrapper } from '../../lib/pageWrapper';

export const EditProduct = withPageWrapper({
  authorizedOnly: true,
  useQuery: () => {
    const { productId } = useParams() as EditProductRouteParams;
    return trpc.getProduct.useQuery({
      productId,
    });
  },
  setProps: ({ queryResult, ctx, checkAccess, checkExists }) => {
    const product = checkExists(queryResult.data.product, 'Товар не найден!');
    checkAccess(ctx.me?.id === product.ownerId, 'Товар может редактировать только владелец');
    return { product };
  },
})(({ product }) => {
  const navigate = useNavigate();
  const updateProduct = trpc.updateProduct.useMutation();

  const formSchema = zUpdateProductTrpcInput.omit({ productId: true });

  // Используем наш хук
  const { formik, alertProps, buttonProps } = useForm({
    initialValues: {
      name: product.name,
      description: product.description,
      image: product.imageFile,
      price: product.price,
      currency: product.currency,
    },
    validationSchema: formSchema,
    successMessage: 'Товар успешно обновлен!',
    onSubmit: async (values) => {
      const success = await updateProduct.mutateAsync({
        productId: product.id,
        name: values.name,
        description: values.description,
        image: values.image,
        price: values.price,
        currency: values.currency,
      });

      if (!success) {
        throw new Error('Не удалось обновить товар');
      }

      navigate(getViewProductPage({ productId: product.id }));
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

          {/* Превью изображения */}
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

          {/* Цена и валюта */}
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

          {/* Скрытое поле URL изображения */}
          <input type="hidden" name="image" value={formik.values.image} />

          {/* Кнопки */}
          <div className={css.submitContainer}>
            <Button {...buttonProps}>Сохранить изменения</Button>

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

          {/* Alert из хука */}
          <Alert {...alertProps} />
        </FormItems>
      </form>
    </div>
  );
});
