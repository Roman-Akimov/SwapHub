import type { AppRouter } from '@swaphub/backend/src/trpc';
import { QueryClient } from '@tanstack/react-query';
import { createTRPCReact, httpBatchLink } from '@trpc/react-query';
import superjson from 'superjson';
import Cookies from 'js-cookie';

export const trpc = createTRPCReact<AppRouter>();

/** Управляет логикой запросов. Имеет настройки.
 * это центральное хранилище React Query, где лежит:
 * кэш данных запросов (ответы сервера)
 * состояние запросов (loading, error, success)
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false, // не переспрашивает данные при возвращении на сайт
    },
  },
});

export const trpcClient = trpc.createClient({
  links: [
    // links в trpc - это аналог middleware
    httpBatchLink({
      // Это link, который отправляет запросы по HTTP на указанный URL /trpc
      url: 'http://localhost:3000/trpc',
      transformer: superjson,
      headers: () => {
        const token = Cookies.get('token');
        return {
          ...(token && { authorization: `Bearer ${token}` }),
        };
      },
    }),
  ],
});

/** Подробное объяснение работы кода:
 * происходит цепочка:

    useQuery просит данные у React Query через queryClient

    React Query проверяет кэш:

    если в кэше есть свежие данные → отдаёт мгновенно

    если нет → запускает запрос

    tRPC вызывает trpcClient

    httpBatchLink формирует HTTP запрос на http://localhost:3000/trpc

    Express на бэке принимает /trpc и отдаёт управление tRPC router’у

    tRPC процедура выполняется, возвращает результат

    React Query кладёт результат в кэш и уведомляет компоненты

    React делает перерендер, и ты видишь data
 */
