import { useParams } from 'react-router-dom';
import { type ViewProductRouteParams } from '../../lib/routes';
import { trpc } from '../../lib/trpc';
import css from './ViewProduct.module.scss'
import { format } from 'date-fns';

export const ViewProductPage = () => {
  const { productId } = useParams() as ViewProductRouteParams;

  const { data, isLoading, isError, error } = trpc.getProduct.useQuery({ productId }, { enabled: !!productId });

  if (isLoading) {
    return <div>Загрузка...</div>;
  }
  if (isError) {
    if (error.data?.code === 'BAD_REQUEST') {
      // Если productId не число
      return <div>Неправильно заданный id</div>;
    }
    if (error.data?.code === 'NOT_FOUND') {
      return <div>Продукт не найден</div>;
    }
    return <div>ЧТо-то пошло не так: {error.message}</div>;
  }
  if (!data?.product) {
    return <div>Извините, продукт не найден..</div>;
  }

  const { product } = data;

  return (
    <div style={{ padding: 20 }}>
      <h1>{product.name}</h1>
      <div className={css.createdAt}>Выставлен: {format(new Date(data.product.createdAt), 'dd.MM.yyyy')}</div>
      <p>
        Цена: {product.price} {product.currency}
      </p>
      <img src={product.imageFile} alt={product.name} width={80} />
      <p>{product.description}</p>
    </div>
  );
};
