export const viewProductRouteParams = { productName: ':productName' };
export type ViewProductRouteParams = { productName: string };
export const getAllProductsPage = () => {
  return '/';
};
export const getViewProductPage = ({ productName }: { productName: string }) => {
  return `/products/${productName}`;
};
