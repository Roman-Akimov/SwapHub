import { useParams } from 'react-router-dom';
import { type ViewProductRouteParams } from '../../lib/routes';

export const ViewProductPage = () => {
  const { productName } = useParams() as ViewProductRouteParams;
  return (
    <div>
      <h1>{productName}</h1>
      <div>
        <p>Text 1</p>
        <p>Text 1</p>
        <p>Text 1</p>
      </div>
    </div>
  );
};
