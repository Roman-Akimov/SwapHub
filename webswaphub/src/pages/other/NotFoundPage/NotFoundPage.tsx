import { ErrorPageComponent } from '../../../components/ErrorPageComponent/ErrorPageComponent';

export const NotFoundPage = ({
  title = 'Не найдено',
  message = 'Данной страницы не существует',
}: {
  title?: string;
  message?: string;
}) => {
  return <ErrorPageComponent title={title} message={message} />;
};
