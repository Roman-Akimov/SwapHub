import { useParams, useNavigate } from 'react-router-dom'; // Добавляем useNavigate
import { type ViewProductRouteParams, getEditProductPage } from '../../lib/routes'; // Добавляем getEditProductPage
import { trpc } from '../../lib/trpc';
import css from './ViewProduct.module.scss';
import { format } from 'date-fns';
import { useMe } from '../../lib/ctx';

export const ViewProductPage = () => {
  const navigate = useNavigate(); // Добавляем navigate для перехода
  const { productId: rawProductId } = useParams() as ViewProductRouteParams;

  // Очищаем ID от возможных пробелов и спецсимволов
  const productId = rawProductId?.trim();

  // Получаем данные о товаре
  const { data, isLoading, isError, error } = trpc.getProduct.useQuery(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    { productId: productId! },
    { enabled: !!productId }
  );

  // Получаем данные о текущем пользователе
  const me = useMe();

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (isError) {
    if (error.data?.code === 'BAD_REQUEST') {
      return <div>Неправильный формат ID товара</div>;
    }
    if (error.data?.code === 'NOT_FOUND') {
      return <div>Продукт не найден</div>;
    }
    return <div>Что-то пошло не так: {error.message}</div>;
  }

  if (!data) {
    return <div>Нет данных</div>;
  }

  const product = data.product || data;

  if (!product) {
    return <div>Извините, продукт не найден..</div>;
  }

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
        Владелец: {data.product.owner.nickName}
        <br />
        {data.product.owner.firstName} {data.product.owner.lastName}
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
};
