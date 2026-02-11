/** Можно написать лучше, без boolean. По возможности, отрефакторить */
const getRouteParams = <T extends Record<string, boolean>>(object: T) => {
  return Object.keys(object).reduce(
    (acc, key) => {
      return { ...acc, [key]: `:${key}` };
    },
    {} // "начальное значение аккумулятора, он явл. объектом"
  ) as Record<keyof T, string>;
};

export const viewProductRouteParams = getRouteParams({ productId: true });

export type ViewProductRouteParams = typeof viewProductRouteParams;

export const getViewProductPage = ({ productId }: ViewProductRouteParams) => {
  return `/products/${productId}`;
};

export const getAllProductsPage = () => {
  return '/';
};

/** Route для страницы CreateProductForm */
export const getNewProductRoute = () => {
  return '/products/new'
};

// export const viewProductRouteParams = { productName: ':productName' };
// export type ViewProductRouteParams = { productName: string };

// export const getViewProductPage = ({ productName }: { productName: string }) => {
//   return `/products/${productName}`;
// };
