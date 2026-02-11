import { Link, Outlet } from 'react-router-dom';
import { getAllProductsPage, getNewProductRoute } from '../../lib/routes';
import css from './Layout.module.scss';

export const Layout = () => {
  return (
    <div className={css.layout}>
      <header className={css.header}>
        <h1 className={css.logo}>Swap Hub</h1>

        <nav className={css.nav}>
          <ul className={css.menu}>
            <li className={css.item}>
              <Link className={css.link} to={getAllProductsPage()}>
                Все товары
              </Link>
            </li>
            <li className={css.item}>
              <Link className={css.link} to={getNewProductRoute()}>
                Выставить товар
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <main className={css.content}>
        <Outlet />
      </main>
    </div>
  );
};
