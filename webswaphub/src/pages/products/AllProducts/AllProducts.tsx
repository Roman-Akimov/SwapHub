import { Link } from 'react-router-dom';
import { getViewProductPage } from '../../../lib/routes';
import { trpc } from '../../../lib/trpc';
import css from './AllProducts.module.scss';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

export const AllProducts = () => {
  const { data, error, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage, isRefetching } =
    trpc.getProducts.useInfiniteQuery(
      {
        limit: 3, // Подгружает по 3 товара за раз
      },
      {
        getNextPageParam: (lastPage) => {
          return lastPage.nextCursor;
        },
      }
    );

  // Используем useInView с дополнительными настройками
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
    // Важно! Не запускаем повторно, если элемент уже был в области видимости
    triggerOnce: false,
  });

  // Эффект для подгрузки при появлении в области видимости
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading || isRefetching) {
    return (
      <div className={css.container}>
        <h1 className={css.title}>Все товары</h1>
        <div>Загрузка товаров...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={css.container}>
        <h1 className={css.title}>Все товары</h1>
        <div style={{ color: 'red' }}>Ошибка: {error.message}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={css.container}>
        <h1 className={css.title}>Все товары</h1>
        <div>Нет данных</div>
      </div>
    );
  }

  const products = data.pages.flatMap((page) => {
    return page.products;
  });

  if (products.length === 0) {
    return (
      <div className={css.container}>
        <h1 className={css.title}>Все товары</h1>
        <div>Нет доступных товаров</div>
      </div>
    );
  }

  return (
    <div className={css.container}>
      <h1 className={css.title}>Все товары</h1>
      <div className={css.products}>
        {products.map((product) => {
          return (
            <Link key={product.id} to={getViewProductPage({ productId: product.id })} className={css.productLink}>
              <div className={css.productCard}>
                <h2 className={css.productName}>{product.name}</h2>
                <p className={css.productPrice}>
                  Price: {product.price} {product.currency}
                </p>
                {product.imageFile && <img src={product.imageFile} alt={product.name} className={css.productImage} />}
                <p className={css.productDescription}>{product.description}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div ref={ref} className={css.loadMoreContainer}>
        {isFetchingNextPage && <div className={css.loading}>Загрузка дополнительных товаров...</div>}
        {!hasNextPage && products.length > 0 && <div className={css.endMessage}>Все товары загружены</div>}
      </div>
    </div>
  );
};
