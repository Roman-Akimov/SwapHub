import { Link } from 'react-router-dom';
import { getViewProductPage } from '../../../lib/routes';
import { trpc } from '../../../lib/trpc';
import css from './AllProducts.module.scss';

export const AllProducts = () => {
  const { data, error, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage, isRefetching } =
    trpc.getProducts.useInfiniteQuery(
      {
        limit: 3,
      },
      {
        getNextPageParam: (lastPage) => {
          return lastPage.nextCursor;
        },
      }
    );

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

      {hasNextPage && (
        <div className={css.loadMore}>
          <button
            onClick={() => {
              return fetchNextPage();
            }}
            disabled={isFetchingNextPage}
            className={css.loadMoreButton}
          >
            {isFetchingNextPage ? 'Загрузка...' : 'Загрузить еще'}
          </button>
        </div>
      )}
    </div>
  );
};
