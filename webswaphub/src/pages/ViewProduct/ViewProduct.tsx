import { useParams, useNavigate } from 'react-router-dom'; // Добавляем useNavigate
import { type ViewProductRouteParams, getEditProductPage } from '../../lib/routes'; // Добавляем getEditProductPage
import { trpc } from '../../lib/trpc';
import css from './ViewProduct.module.scss';
import { format } from 'date-fns';
import { useMe } from '../../lib/ctx';
import { withPageWrapper } from '../../lib/pageWrapper';
import type { AppRouterOutput } from '@swaphub/backend/src/lib/router/router';

export const ViewProductPage = withPageWrapper({
  // Загружаем данные о товаре
  useQuery: () => {
    const { productId: rawProductId } = useParams() as ViewProductRouteParams;
    const productId = rawProductId?.trim();

    return trpc.getProduct.useQuery(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      { productId: productId! },
      { enabled: !!productId }
    );
  },

  // Проверяем, что товар существует
  checkExists: ({ queryResult }) => {
    return !!queryResult.data.product;
  },
  checkExistsMessage: 'Товар не найден',

  // Передаем данные в компонент
  setProps: ({ queryResult }) => {
    return {
      product: queryResult.data.product,
    };
  },
})(({ product }: { product: NonNullable<AppRouterOutput['getProduct']['product']> }) => {
  const navigate = useNavigate();
  const me = useMe();

  // Проверяем, является ли текущий пользователь владельцем товара
  const isOwner = me?.id === product.ownerId;
  return (
    <div style={{ padding: 20 }}>
      {/* Шапка с названием и кнопкой редактирования (если владелец) */}
      <div className={css.header}>
        <h1>{product.name}</h1>
      </div>

      <div className={css.createdAt}>Выставлен: {format(new Date(product.createdAt), 'dd.MM.yyyy')}</div>

      <p>
        Цена: {product.price} {product.currency}
      </p>

      <img src={product.imageFile} alt={product.name} width={80} />

      <p>{product.description}</p>

      <div className={css.owner}>
        Владелец: {product.owner.nickName}
        <br />
        {product.owner.firstName} {product.owner.lastName}
      </div>

      {isOwner && (
        <button
          className={css.editButton}
          onClick={() => {
            return navigate(getEditProductPage({ productId: product.id }));
          }}
        >
          Редактировать
        </button>
      )}
    </div>
  );
});
