/** Можно написать лучше, без boolean. По возможности, отрефакторить */
const getRouteParams = <T extends Record<string, boolean>>(object: T) => {
  return Object.keys(object).reduce(
    (acc, key) => {
      return { ...acc, [key]: `:${key}` };
    },
    {} // "начальное значение аккумулятора, он явл. объектом"
  ) as Record<keyof T, string>;
};

export const viewProductRouteParams = getRouteParams({ productName: true });

export type ViewProductRouteParams = typeof viewProductRouteParams;

export const getViewProductPage = ({ productName }: ViewProductRouteParams) => {
  return `/products/${productName}`;
};

export const getAllProductsPage = () => {
  return '/';
};

// export const viewProductRouteParams = { productName: ':productName' };
// export type ViewProductRouteParams = { productName: string };

// export const getViewProductPage = ({ productName }: { productName: string }) => {
//   return `/products/${productName}`;
// };
