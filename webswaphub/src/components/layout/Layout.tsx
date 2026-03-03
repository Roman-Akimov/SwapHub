import { Link, Outlet } from 'react-router-dom';
import {
  getAllProductsRoute,
  getNewProductRoute,
  getSignInRoute,
  getSignOutRoute,
  getSignUpRoute,
} from '../../lib/routes';
import css from './Layout.module.scss';
import { useMe } from '../../lib/ctx';

export const Layout = () => {
  const me = useMe(); // просто пользователь или null

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

            {/* Просто проверяем - есть пользователь или нет */}
            {me ? (
              // Контент для авторизованных пользователей
              <>
                <li className={css.item}>
                  <Link className={css.link} to={getNewProductRoute()}>
                    Выставить товар
                  </Link>
                </li>
                <li className={css.item}>
                  <Link className={css.link} to={getSignOutRoute()}>
                    Выйти ({me.nickName})
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
          </ul>
        </nav>
      </header>

      <main className={css.content}>
        <Outlet />
      </main>
    </div>
  );
};
