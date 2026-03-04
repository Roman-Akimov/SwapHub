/** Можно написать лучше, без boolean. По возможности, отрефакторить */
const getRouteParams = <T extends Record<string, boolean>>(object: T) => {
  return Object.keys(object).reduce(
    (acc, key) => {
      return { ...acc, [key]: `:${key}` };
    },
    {} // "начальное значение аккумулятора, он явл. объектом"
  ) as Record<keyof T, string>;
};

export const getAllProductsRoute = () => {
  return '/';
};

/** Route для страницы CreateProductForm */
export const getNewProductRoute = () => {
  return '/products/new';
};

export const getSignUpRoute = () => {
  return '/sign-up';
};

export const getSignInRoute = () => {
  return '/sign-in';
};

export const getSignOutRoute = () => {
  return '/sign-out';
};

export const getEditProfileRoute = () => {
  return '/edit-profile';
};

export const viewProductRouteParams = getRouteParams({ productId: true });

export type ViewProductRouteParams = typeof viewProductRouteParams;

export const getViewProductPage = ({ productId }: ViewProductRouteParams) => {
  return `/products/${productId}`;
};

export const editProductRouteParams = getRouteParams({ productId: true });
export type EditProductRouteParams = typeof viewProductRouteParams;
export const getEditProductPage = ({ productId }: EditProductRouteParams) => {
  return `/products/${productId}/edit`;
};

// export const viewProductRouteParams = { productName: ':productName' };
// export type ViewProductRouteParams = { productName: string };

// export const getViewProductPage = ({ productName }: { productName: string }) => {
//   return `/products/${productName}`;
// };
