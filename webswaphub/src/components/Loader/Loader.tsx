import cn from 'classnames';
import css from './Loader.module.scss';

export const Loader = ({ type }: { type: 'page' | 'section' }) => {
  return (
    <span
      className={cn({
        [css.loader]: true,
        [css[`type-${type}`]]: true,
      })}
    />
  );
};
