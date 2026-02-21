import { useParams } from 'react-router-dom';
import { type ViewProductRouteParams } from '../../lib/routes';
import { trpc } from '../../lib/trpc';
import css from './ViewProduct.module.scss'
import { format } from 'date-fns';

export const ViewProductPage = () => {
  const { productId: rawProductId } = useParams() as ViewProductRouteParams;
  
  // Очищаем ID от возможных пробелов и спецсимволов
  const productId = rawProductId?.trim();

  const { data, isLoading, isError, error } = trpc.getProduct.useQuery(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    { productId: productId! }, 
    { enabled: !!productId }
  );

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

  return (
    <div style={{ padding: 20 }}>
      <h1>{product.name}</h1>
      <div className={css.createdAt}>
        Выставлен: {format(new Date(product.createdAt), 'dd.MM.yyyy')}
      </div>
      <p>
        Цена: {product.price} {product.currency}
      </p>
      <img src={product.imageFile} alt={product.name} width={80} />
      <p>{product.description}</p>
    </div>
  );
};