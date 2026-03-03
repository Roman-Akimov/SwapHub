import { type UseTRPCQueryResult, type UseTRPCQuerySuccessResult } from '@trpc/react-query/shared';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorPageComponent } from '../components/ErrorPageComponent/ErrorPageComponent';
import { UseAppContext, type AppContext } from './ctx';
import { getAllProductsRoute } from './routes';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = Record<string, any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type QueryResult = UseTRPCQueryResult<any, any>;
type QuerySuccessResult<TQueryResult extends QueryResult> = UseTRPCQuerySuccessResult<
  NonNullable<TQueryResult['data']>,
  null
>;
type HelperProps<TQueryResult extends QueryResult | undefined> = {
  ctx: AppContext;
  queryResult: TQueryResult extends QueryResult ? QuerySuccessResult<TQueryResult> : undefined;
};
type PageWrapperProps<TProps extends Props, TQueryResult extends QueryResult | undefined> = {
  redirectAuthorized?: boolean;

  authorizedOnly?: boolean;
  authorizedOnlyTitle?: string;
  authorizedOnlyMessage?: string;

  checkAccess?: (helperProps: HelperProps<TQueryResult>) => boolean;
  checkAccessTitle?: string;
  checkAccessMessage?: string;

  checkExists?: (helperProps: HelperProps<TQueryResult>) => boolean;
  checkExistsTitle?: string;
  checkExistsMessage?: string;

  useQuery?: () => TQueryResult;
  setProps?: (helperProps: HelperProps<TQueryResult>) => TProps;
  Page: React.FC<TProps>;
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
const PageWrapper = <TProps extends Props = {}, TQueryResult extends QueryResult | undefined = undefined>({
  authorizedOnly,
  authorizedOnlyTitle = 'Пожалуйста, авторизуйтесь',
  authorizedOnlyMessage = 'Эта страница доступна только авторизованным пользователям',
  redirectAuthorized,
  checkAccess,
  checkAccessTitle = 'Доступ запрещен',
  checkAccessMessage = 'У Вас нет доступа к данной странице',
  checkExists,
  checkExistsTitle = 'Не найдено',
  checkExistsMessage = 'Такой страницы не существует',
  useQuery,
  setProps,
  Page,
}: PageWrapperProps<TProps, TQueryResult>) => {
  const navigate = useNavigate();
  const ctx = UseAppContext();
  const queryResult = useQuery?.();

  const redirectNeeded = redirectAuthorized && ctx.me;

  useEffect(() => {
    if (redirectNeeded) {
      navigate(getAllProductsRoute(), { replace: true });
    }
  }, [redirectNeeded, navigate]);

  if (queryResult?.isLoading || queryResult?.isFetching || redirectNeeded) {
    return <p>Загрузка...</p>;
  }

  if (queryResult?.isError) {
    return <ErrorPageComponent message={queryResult.error.message} />;
  }

  if (authorizedOnly && !ctx.me) {
    return <ErrorPageComponent title={authorizedOnlyTitle} message={authorizedOnlyMessage} />;
  }

  const helperProps = { ctx, queryResult: queryResult as never };

  if (checkAccess) {
    const accessDenied = !checkAccess(helperProps);
    if (accessDenied) {
      return <ErrorPageComponent title={checkAccessTitle} message={checkAccessMessage} />;
    }
  }

  if (checkExists) {
    const notExists = !checkExists(helperProps);
    if (notExists) {
      return <ErrorPageComponent title={checkExistsTitle} message={checkExistsMessage} />;
    }
  }

  const props = setProps?.(helperProps) as TProps;
  return <Page {...props} />;
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export const withPageWrapper = <TProps extends Props = {}, TQueryResult extends QueryResult | undefined = undefined>(
  pageWrapperProps: Omit<PageWrapperProps<TProps, TQueryResult>, 'Page'>
) => {
  return (Page: PageWrapperProps<TProps, TQueryResult>['Page']) => {
    // eslint-disable-next-line react/display-name
    return () => {
      return <PageWrapper {...pageWrapperProps} Page={Page} />;
    };
  };
};
