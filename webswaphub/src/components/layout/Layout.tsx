import { Link, Outlet } from 'react-router-dom';
import {
  getAllProductsRoute,
  getNewProductRoute,
  getSignInRoute,
  getSignOutRoute,
  getSignUpRoute,
} from '../../lib/routes';
import css from './Layout.module.scss';
import { trpc } from '../../lib/trpc';
import { useEffect } from 'react';

export const Layout = () => {
  const { data, isLoading, isFetching } = trpc.getMe.useQuery();

  // Добавим логи
  useEffect(() => {}, [data, isLoading, isFetching]);

  const isAuthLoading = isLoading || isFetching;
  const isAuthenticated = data?.me !== null && data?.me !== undefined;

  return (
    <div className={css.layout}>
      <header className={css.header}>
        <h1 className={css.logo}>Swap Hub</h1>

        <nav className={css.nav}>
          <ul className={css.menu}>
            <li className={css.item}>
              <Link className={css.link} to={getAllProductsRoute()}>
                Все товары
              </Link>
            </li>

            {!isAuthLoading && (
              <>
                {isAuthenticated ? (
                  // Контент для авторизованных пользователей
                  <>
                    <li className={css.item}>
                      <Link className={css.link} to={getNewProductRoute()}>
                        Выставить товар
                      </Link>
                    </li>
                    <li className={css.item}>
                      <Link className={css.link} to={getSignOutRoute()}>
                        Log Out ({data.me?.nickName})
                      </Link>
                    </li>
                  </>
                ) : (
                  // Контент для НЕ авторизованных пользователей
                  <>
                    <li className={css.item}>
                      <Link className={css.link} to={getSignUpRoute()}>
                        Регистрация
                      </Link>
                    </li>
                    <li className={css.item}>
                      <Link className={css.link} to={getSignInRoute()}>
                        Вход
                      </Link>
                    </li>
                  </>
                )}
              </>
            )}
            {isAuthLoading && (
              <li className={css.item}>
                <span className={css.loading}>Загрузка...</span>
              </li>
            )}
          </ul>
        </nav>
      </header>

      <main className={css.content}>
        <Outlet />
      </main>
    </div>
  );
};
